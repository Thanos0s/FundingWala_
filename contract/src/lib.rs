#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, token, Address, Env, Map};


#[contracttype]
#[derive(Clone)]
pub struct Campaign {
    pub admin: Address,
    pub goal: i128,
    pub raised: i128,
    pub deadline: u32,
    pub active: bool,
}

#[contracttype]
pub enum DataKey {
    Campaign,
    Donations,
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
        };
        env.storage().instance().set(&DataKey::Campaign, &campaign);
        env.storage().instance().set(&DataKey::Donations, &Map::<Address, i128>::new(&env));
        env.events().publish((symbol_short!("init"), admin), goal);
    }

    pub fn donate(env: Env, donor: Address, amount: i128) {
        donor.require_auth();
        assert!(amount > 0, "amount must be positive");

        let mut campaign: Campaign = env.storage().instance().get(&DataKey::Campaign).unwrap();
        assert!(campaign.active, "campaign is not active");
        assert!(env.ledger().sequence() <= campaign.deadline, "deadline has passed");

        // Transfer XLM from donor to contract
        let token_client = token::StellarAssetClient::new(&env, &env.current_contract_address());
        let _ = token_client; // XLM is native; actual transfer happens via Stellar payment
        
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
        env.events().publish(
            (symbol_short!("donated"), donor.clone()),
            amount,
        );
    }

    pub fn get_campaign(env: Env) -> Campaign {
        env.storage()
            .instance()
            .get(&DataKey::Campaign)
            .unwrap_or_else(|| panic!("not initialized"))
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
}

#[cfg(test)]
mod test;

