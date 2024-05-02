use chrono::{Date, DateTime, FixedOffset, Local, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Signature {
    pub _id: String,
    pub status: bool,
}
#[derive(Debug, Deserialize, Serialize, Clone, Copy)]
pub enum Mode {
    #[serde(rename = "advance")]
    Advance,
    #[serde(rename = "basic")]
    Basic,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GenerateRequest {
    pub mode: Mode,
    pub name: String,
    pub symbol: String,
    pub decimal: Option<u128>,
    pub supply: Option<u128>,
    #[serde(rename = "maxBuy")]
    pub max_buy: Option<u128>,
    #[serde(rename = "initialLP")]
    pub initial_lp: Option<u128>,
    pub owner: String,
    pub mintable: Option<bool>,
    #[serde(rename = "liquidityFee")]
    pub liquidity_fee: Option<i8>,
    #[serde(rename = "totalSupply")]
    pub total_supply: Option<u128>,
    #[serde(rename = "redistributionTax")]
    pub redistribution_tax: Option<i8>,
    #[serde(rename = "charityFee")]
    pub charity_fee: Option<i8>,
    #[serde(rename = "marketingFee")]
    pub marketing_fee: Option<i8>,
    #[serde(rename = "burnFee")]
    pub burn_fee: Option<i8>,
    #[serde(rename = "teamWalletAddress")]
    pub team_wallet_address: Option<String>,
    #[serde(rename = "teamDistributionPercentage")]
    pub team_distribution_percentage: Option<i8>,
    #[serde(rename = "unlockTime")]
    pub unlock_time: Option<String>,
}
#[derive(Debug)]
pub struct GenerateParams {
    pub mode: Mode,
    pub name: String,
    pub symbol: String,
    pub decimal: u128,
    pub supply: u128,
    pub max_buy: u128,
    pub initial_lp: u128,
    pub owner: String,
    pub mintable: bool,
    pub liquidity_fee: i8,
    pub total_supply: u128,
    pub redistribution_tax: i8,
    pub charity_fee: i8,
    pub marketing_fee: i8,
    pub burn_fee: i8,
    pub team_wallet_address: String,
    pub team_distribution_percentage: i8,
    pub unlock_time: i64,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct GenerateResponse {
    pub url: String,
}

impl GenerateRequest {
    pub fn validate(&self) -> GenerateParams {
        let dt = match DateTime::parse_from_str(
            &self.unlock_time.clone().unwrap(),
            "%m/%d/%Y, %I:%M:%S %p",
        ) {
            Ok(dt) => dt.with_timezone(&Local),
            Err(_) => Local::now(),
        };

        // Extract the timestamp from the DateTime object
        let time = dt.timestamp();

        GenerateParams {
            mode: self.mode.clone(),
            name: self.name.clone(),
            symbol: self.symbol.clone(),
            decimal: self.decimal.clone().unwrap_or(0),
            supply: self.supply.clone().unwrap_or(1000000),
            max_buy: self.max_buy.clone().unwrap_or(1000000),
            initial_lp: self.initial_lp.clone().unwrap_or(800000),
            owner: self.owner.clone(),
            mintable: self.mintable.unwrap_or(false),
            liquidity_fee: self.liquidity_fee.clone().unwrap_or(0),
            total_supply: self.total_supply.clone().unwrap_or(1000000),
            redistribution_tax: self.redistribution_tax.clone().unwrap_or(0),
            charity_fee: self.charity_fee.clone().unwrap_or(0),
            marketing_fee: self.marketing_fee.clone().unwrap_or(0),
            burn_fee: self.burn_fee.clone().unwrap_or(0),
            team_wallet_address: self
                .team_wallet_address
                .clone()
                .unwrap_or(self.owner.clone()),
            team_distribution_percentage: self.team_distribution_percentage.clone().unwrap_or(0),
            unlock_time: time,
        }
    }
}
