#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_initialize_and_milestones() {
    let env = Env::default();
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.mock_all_auths().initialize(&admin, &1000_0000000, &1000);

    let campaign = client.get_campaign();
    assert_eq!(campaign.admin, admin);
    assert_eq!(campaign.goal, 1000_0000000);
    assert_eq!(campaign.raised, 0);
    assert_eq!(campaign.total_milestones, 3);

    let milestones = client.get_milestones();
    assert_eq!(milestones.len(), 3);
    assert_eq!(milestones.get(0).unwrap().target_amount, 300_0000000);
    assert_eq!(milestones.get(1).unwrap().target_amount, 400_0000000);
    assert_eq!(milestones.get(2).unwrap().target_amount, 300_0000000);
}

#[test]
fn test_donate_and_vote_milestone() {
    let env = Env::default();
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let donor1 = Address::generate(&env);
    let donor2 = Address::generate(&env);

    client.mock_all_auths().initialize(&admin, &1000_0000000, &1000);
    client.mock_all_auths().donate(&donor1, &100_0000000);
    client.mock_all_auths().donate(&donor2, &50_0000000);

    assert_eq!(client.get_raised(), 150_0000000);

    // Vote on milestone 1
    client.mock_all_auths().vote_milestone(&donor1, &1, &true);
    client.mock_all_auths().vote_milestone(&donor2, &1, &true);

    let milestones = client.get_milestones();
    let m1 = milestones.get(0).unwrap();
    assert_eq!(m1.approvals, 2);
    assert_eq!(m1.rejections, 0);
}

#[test]
fn test_release_milestone_tranche() {
    let env = Env::default();
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let donor = Address::generate(&env);

    client.mock_all_auths().initialize(&admin, &1000_0000000, &1000);
    client.mock_all_auths().donate(&donor, &500_0000000);

    // Donor approves milestone 1
    client.mock_all_auths().vote_milestone(&donor, &1, &true);

    // Admin releases tranche 1
    client.mock_all_auths().release_milestone_tranche(&admin, &1);

    let campaign = client.get_campaign();
    assert_eq!(campaign.released_amount, 300_0000000);

    let milestones = client.get_milestones();
    assert_eq!(milestones.get(0).unwrap().released, true);
}

#[test]
fn test_log_expenditure_and_reputation() {
    let env = Env::default();
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let vendor = Address::generate(&env);
    let donor = Address::generate(&env);

    client.mock_all_auths().initialize(&admin, &1000_0000000, &1000);
    client.mock_all_auths().donate(&donor, &500_0000000);
    client.mock_all_auths().vote_milestone(&donor, &1, &true);
    client.mock_all_auths().release_milestone_tranche(&admin, &1);

    // Log transparent expenditure
    client.mock_all_auths().log_expenditure(
        &admin,
        &1,
        &250_0000000,
        &vendor,
        &symbol_short!("Pipes"),
        &symbol_short!("PipesPVC"),
    );

    let logs = client.get_spending_logs();
    assert_eq!(logs.len(), 1);
    assert_eq!(logs.get(0).unwrap().amount, 250_0000000);
    assert_eq!(logs.get(0).unwrap().recipient, vendor);

    let rep = client.get_creator_reputation();
    assert_eq!(rep.completed_milestones, 1);
    assert_eq!(rep.total_delivered_xlm, 300_0000000);
    assert!(rep.trust_score >= 90);
}
