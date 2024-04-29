use serde::{Deserialize, Serialize};

#[derive(Debug,Deserialize,Serialize)]
pub struct Signature {
  pub  _id: String,
  pub  status:bool
}
#[derive(Debug,Deserialize,Serialize)]
pub enum Mode {
  #[serde(rename="advance")]
  Advance,
  #[serde(rename="basic")]
    Basic
}

#[derive(Debug,Deserialize,Serialize)]
pub struct GenerateRequest {
  pub mode:Mode,
  pub name:String,
  pub symbol:String,
  pub decimal: Option<u128>,
  pub supply:  Option<u128>,
  #[serde(rename="maxBuy")]
  pub max_buy:  Option<u128>,
  #[serde(rename="initialLP")]
  pub initial_lp:  Option<u128>,
  pub owner: String,
  pub mintable:Option<bool>,
  #[serde(rename="liquidityFee")]
  pub liquidity_fee:Option<i8>,
  #[serde(rename="totalSupply")]
  pub total_supply:Option<u128>,
  #[serde(rename="redistributionTax")]
  pub redistribution_tax:Option<i8>,
  #[serde(rename="charityFee")]
  pub charity_fee:Option<i8>,
  #[serde(rename="marketingFee")]
  pub marketing_fee:Option<i8>,
  #[serde(rename="burnFee")]
  pub burn_fee:Option<i8>,
  #[serde(rename="teamWalletAddress")]
  pub team_wallet_address:Option<String>,
  #[serde(rename="teamDistributionPercentage")]
  pub team_distribution_percentage:Option<i8>,
  #[serde(rename="unlockTime")]
  pub unlock_time:Option<String>,
}
#[derive(Debug,Deserialize,Serialize)]
pub struct GenerateResponse {
  pub url:String,
  // pub symbol:String,
  // pub decimal: Option<u128>,
  // pub supply:  Option<u128>,
  // #[serde(rename="maxBuy")]
  // pub max_buy:  Option<u128>,
  // #[serde(rename="initialLP")]
  // pub initial_lp:  Option<u128>,
  // pub owner: String,
}