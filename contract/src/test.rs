#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_initialize_and_get_campaign() {
    let env = Env::default();
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.mock_all_auths().initialize(&admin, &1000_0000000, &1000);

    let campaign = client.get_campaign();
    assert_eq!(campaign.admin, admin);
    assert_eq!(campaign.goal, 1000_0000000);
    assert_eq!(campaign.raised, 0);
    assert_eq!(campaign.deadline, 1000);
    assert_eq!(campaign.active, true);
}

#[test]
fn test_donate_success() {
    let env = Env::default();
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let donor = Address::generate(&env);

    client.mock_all_auths().initialize(&admin, &1000_0000000, &1000);
    client.mock_all_auths().donate(&donor, &50_0000000);

    assert_eq!(client.get_raised(), 50_0000000);
    assert_eq!(client.get_donor_amount(&donor), 50_0000000);
}

#[test]
fn test_multiple_donations() {
    let env = Env::default();
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let donor1 = Address::generate(&env);
    let donor2 = Address::generate(&env);

    client.mock_all_auths().initialize(&admin, &1000_0000000, &1000);
    client.mock_all_auths().donate(&donor1, &30_0000000);
    client.mock_all_auths().donate(&donor2, &70_0000000);
    client.mock_all_auths().donate(&donor1, &20_0000000);

    assert_eq!(client.get_raised(), 120_0000000);
    assert_eq!(client.get_donor_amount(&donor1), 50_0000000);
    assert_eq!(client.get_donor_amount(&donor2), 70_0000000);
}
