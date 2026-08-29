#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, Map, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    pub admin: Address,
    pub goal: i128,
    pub raised: i128,
    pub deadline: u32,
    pub active: bool,
    pub released_amount: i128,
    pub total_milestones: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Milestone {
    pub id: u32,
    pub title: Symbol,
    pub target_amount: i128,
    pub deadline: u32,
    pub approvals: u32,
    pub rejections: u32,
    pub released: bool,
    pub disputed: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SpendingRecord {
    pub id: u32,
    pub milestone_id: u32,
    pub amount: i128,
    pub recipient: Address,
    pub category: Symbol,
    pub description: Symbol,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreatorReputation {
    pub completed_milestones: u32,
    pub total_campaigns: u32,
    pub total_delivered_xlm: i128,
    pub trust_score: u32, // 0 to 100
}

#[contracttype]
pub enum DataKey {
    Campaign,
    Donations,
    Milestones,
    SpendingLogs,
    Voters(u32), // milestone_id -> Map<Address, bool>
    Refunded(Address),
}

#[contract]
pub struct CrowdfundingContract;

#[contractimpl]
impl CrowdfundingContract {
    pub fn initialize(env: Env, admin: Address, goal: i128, deadline_ledger: u32) {
        admin.require_auth();
        if env.storage().instance().has(&DataKey::Campaign) {
            panic!("already initialized");
        }
        let campaign = Campaign {
            admin: admin.clone(),
            goal,
            raised: 0,
            deadline: deadline_ledger,
            active: true,
            released_amount: 0,
            total_milestones: 3,
        };
        env.storage().instance().set(&DataKey::Campaign, &campaign);
        env.storage().instance().set(&DataKey::Donations, &Map::<Address, i128>::new(&env));

        // Initialize default 3 escrow milestone tranches (30%, 40%, 30%)
        let mut milestones = Vec::<Milestone>::new(&env);
        let m1_amt = (goal * 30) / 100;
        let m2_amt = (goal * 40) / 100;
        let m3_amt = goal - m1_amt - m2_amt;

        milestones.push_back(Milestone {
            id: 1,
            title: symbol_short!("Survey"),
            target_amount: m1_amt,
            deadline: deadline_ledger / 3,
            approvals: 0,
            rejections: 0,
            released: false,
            disputed: false,
        });

        milestones.push_back(Milestone {
            id: 2,
            title: symbol_short!("Drilling"),
            target_amount: m2_amt,
            deadline: (deadline_ledger * 2) / 3,
            approvals: 0,
            rejections: 0,
            released: false,
            disputed: false,
        });

        milestones.push_back(Milestone {
            id: 3,
            title: symbol_short!("Pipeline"),
            target_amount: m3_amt,
            deadline: deadline_ledger,
            approvals: 0,
            rejections: 0,
            released: false,
            disputed: false,
        });

        env.storage().instance().set(&DataKey::Milestones, &milestones);
        env.storage().instance().set(&DataKey::SpendingLogs, &Vec::<SpendingRecord>::new(&env));
        env.events().publish((symbol_short!("init"), admin), goal);
    }

    pub fn donate(env: Env, donor: Address, amount: i128) {
        donor.require_auth();
        assert!(amount > 0, "amount must be positive");

        let mut campaign: Campaign = env.storage().instance().get(&DataKey::Campaign).unwrap();
        assert!(campaign.active, "campaign is not active");
        assert!(env.ledger().sequence() <= campaign.deadline, "deadline has passed");

        let token_client = token::StellarAssetClient::new(&env, &env.current_contract_address());
        let _ = token_client;

        campaign.raised += amount;
        env.storage().instance().set(&DataKey::Campaign, &campaign);

        // Track individual donation
        let mut donations: Map<Address, i128> = env
            .storage()
            .instance()
            .get(&DataKey::Donations)
            .unwrap_or_else(|| Map::new(&env));
        let existing = donations.get(donor.clone()).unwrap_or(0);
        donations.set(donor.clone(), existing + amount);
        env.storage().instance().set(&DataKey::Donations, &donations);

        // Emit event
        env.events().publish((symbol_short!("donated"), donor.clone()), amount);
    }

    pub fn vote_milestone(env: Env, voter: Address, milestone_id: u32, approve: bool) {
        voter.require_auth();

        let donations: Map<Address, i128> = env
            .storage()
            .instance()
            .get(&DataKey::Donations)
            .unwrap_or_else(|| Map::new(&env));
        let donation = donations.get(voter.clone()).unwrap_or(0);
        assert!(donation > 0, "only donors can vote");

        let key = DataKey::Voters(milestone_id);
        let mut voters: Map<Address, bool> = env
            .storage()
            .instance()
            .get(&key)
            .unwrap_or_else(|| Map::new(&env));
        assert!(!voters.contains_key(voter.clone()), "already voted on this milestone");

        voters.set(voter.clone(), approve);
        env.storage().instance().set(&key, &voters);

        let mut milestones: Vec<Milestone> = env.storage().instance().get(&DataKey::Milestones).unwrap();
        let mut found = false;

        for i in 0..milestones.len() {
            let mut m = milestones.get(i).unwrap();
            if m.id == milestone_id {
                assert!(!m.released, "milestone already released");
                if approve {
                    m.approvals += 1;
                } else {
                    m.rejections += 1;
                }
                milestones.set(i, m);
                found = true;
                break;
            }
        }
        assert!(found, "milestone not found");
        env.storage().instance().set(&DataKey::Milestones, &milestones);

        env.events().publish(
            (symbol_short!("vote"), voter),
            (milestone_id, approve),
        );
    }

    pub fn release_milestone_tranche(env: Env, caller: Address, milestone_id: u32) {
        caller.require_auth();
        let mut campaign: Campaign = env.storage().instance().get(&DataKey::Campaign).unwrap();
        assert!(campaign.admin == caller, "only admin can release tranche");

        let mut milestones: Vec<Milestone> = env.storage().instance().get(&DataKey::Milestones).unwrap();
        let mut released_amt: i128 = 0;

        for i in 0..milestones.len() {
            let mut m = milestones.get(i).unwrap();
            if m.id == milestone_id {
                assert!(!m.released, "already released");
                assert!(!m.disputed, "milestone is in dispute");
                assert!(m.approvals >= m.rejections, "milestone rejected by voters");

                m.released = true;
                released_amt = m.target_amount;
                milestones.set(i, m);
                break;
            }
        }
        assert!(released_amt > 0, "milestone not found or invalid amount");

        campaign.released_amount += released_amt;
        env.storage().instance().set(&DataKey::Campaign, &campaign);
        env.storage().instance().set(&DataKey::Milestones, &milestones);

        env.events().publish(
            (symbol_short!("release"), caller),
            (milestone_id, released_amt),
        );
    }

    pub fn log_expenditure(
        env: Env,
        admin: Address,
        milestone_id: u32,
        amount: i128,
        recipient: Address,
        category: Symbol,
        description: Symbol,
    ) {
        admin.require_auth();
        let campaign: Campaign = env.storage().instance().get(&DataKey::Campaign).unwrap();
        assert!(campaign.admin == admin, "only admin can log expenditures");

        let mut logs: Vec<SpendingRecord> = env
            .storage()
            .instance()
            .get(&DataKey::SpendingLogs)
            .unwrap_or_else(|| Vec::new(&env));

        let record = SpendingRecord {
            id: (logs.len() as u32) + 1,
            milestone_id,
            amount,
            recipient,
            category,
            description,
            timestamp: env.ledger().timestamp(),
        };

        logs.push_back(record);
        env.storage().instance().set(&DataKey::SpendingLogs, &logs);

        env.events().publish((symbol_short!("spend"), admin), (milestone_id, amount));
    }

    pub fn claim_refund(env: Env, donor: Address) -> i128 {
        donor.require_auth();

        let campaign: Campaign = env.storage().instance().get(&DataKey::Campaign).unwrap();
        let is_expired = env.ledger().sequence() > campaign.deadline;
        let goal_missed = campaign.raised < campaign.goal;
        assert!(is_expired && goal_missed, "campaign is active or reached goal");

        let key = DataKey::Refunded(donor.clone());
        assert!(!env.storage().instance().has(&key), "already claimed refund");

        let donations: Map<Address, i128> = env.storage().instance().get(&DataKey::Donations).unwrap();
        let donated = donations.get(donor.clone()).unwrap_or(0);
        assert!(donated > 0, "no donations found to refund");

        // Calculate proportional unspent refund
        let unspent = campaign.raised - campaign.released_amount;
        let refund_amt = if campaign.raised > 0 {
            (donated * unspent) / campaign.raised
        } else {
            0
        };
        assert!(refund_amt > 0, "no unspent funds remaining");

        env.storage().instance().set(&key, &true);
        env.events().publish((symbol_short!("refund"), donor), refund_amt);

        refund_amt
    }

    pub fn get_campaign(env: Env) -> Campaign {
        env.storage().instance().get(&DataKey::Campaign).unwrap()
    }

    pub fn get_milestones(env: Env) -> Vec<Milestone> {
        env.storage().instance().get(&DataKey::Milestones).unwrap_or_else(|| Vec::new(&env))
    }

    pub fn get_spending_logs(env: Env) -> Vec<SpendingRecord> {
        env.storage().instance().get(&DataKey::SpendingLogs).unwrap_or_else(|| Vec::new(&env))
    }

    pub fn get_raised(env: Env) -> i128 {
        let campaign: Campaign = env.storage().instance().get(&DataKey::Campaign).unwrap();
        campaign.raised
    }

    pub fn get_donor_amount(env: Env, donor: Address) -> i128 {
        let donations: Map<Address, i128> = env
            .storage()
            .instance()
            .get(&DataKey::Donations)
            .unwrap_or_else(|| Map::new(&env));
        donations.get(donor).unwrap_or(0)
    }

    pub fn get_creator_reputation(env: Env) -> CreatorReputation {
        let milestones: Vec<Milestone> = env.storage().instance().get(&DataKey::Milestones).unwrap_or_else(|| Vec::new(&env));
        let mut completed: u32 = 0;
        let mut total_delivered: i128 = 0;

        for i in 0..milestones.len() {
            let m = milestones.get(i).unwrap();
            if m.released {
                completed += 1;
                total_delivered += m.target_amount;
            }
        }

        let trust_score = if milestones.len() > 0 {
            85 + (completed * 5)
        } else {
            85
        };

        CreatorReputation {
            completed_milestones: completed,
            total_campaigns: 1,
            total_delivered_xlm: total_delivered,
            trust_score: if trust_score > 100 { 100 } else { trust_score },
        }
    }
}

#[cfg(test)]
mod test;
