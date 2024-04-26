use serde::{Deserialize, Serialize};

#[derive(Debug,Deserialize,Serialize)]
pub struct Signature {
  pub  _id: String,
  pub  status:bool
}

#[derive(Debug,Deserialize,Serialize)]
pub struct GenerateRequest {
  pub name:String,
  pub symbol:String,
  pub decimal: Option<u128>,
  pub supply:  Option<u128>,
  #[serde(rename="maxBuy")]
  pub max_buy:  Option<u128>,
  #[serde(rename="initialLP")]
  pub initial_lp:  Option<u128>,
  pub owner: String,
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