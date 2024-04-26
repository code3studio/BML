use std::fmt::Error;
use std::fs::{self, File};
use std::io::{self, prelude::*};
use std::process::Command;

use actix_web::web::Json;
use regex::Regex;

use crate::model::signature_model::GenerateRequest;

pub fn generate_contract(data: Json<GenerateRequest>) -> std::io::Result<String> {
    // Create a new file named "example.sol"
    println!("hi");
    let mut file = File::create("./src/smart_contract/contracts/MyExample.sol")?;

    // Write some content to the file
    file.write_all(
        b"
        // SPDX-License-Identifier: MIT\n
        // Compatible with OpenZeppelin Contracts ^5.0.0\n
        pragma solidity ^0.8.20;\n
        
        import \"@openzeppelin/contracts/token/ERC20/ERC20.sol\";\n
        import \"@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol\";\n
        import \"@openzeppelin/contracts/access/Ownable.sol\";\n
        import \"@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol\";\n\n
        
        contract MyToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {\n
          

            constructor(address initialOwner,string memory _name, string memory _symbol )\n
                ERC20(_name, _symbol)\n
                Ownable(initialOwner)\n
                ERC20Permit(_name)\n
            {}
        
            function mint(address to, uint256 amount) public onlyOwner {
                _mint(to, amount);
            }
        }
    ",
    )?;

    println!("File 'example.sol' created successfully!");
    make_deploy_ts(&data.name, &data.symbol, &data.owner).unwrap();
 let result =   write_script();
    Ok(result)
}

fn make_deploy_ts(token_name: &str, symbol: &str, address: &str) -> std::io::Result<()> {
    let mut file = File::create("./src/smart_contract/ignition/modules/Token.ts")?;

    file.write_all(
        format!(
            r#"
        const {{ buildModule }} = require("@nomicfoundation/hardhat-ignition/modules");

        const TokenModule = buildModule("TokenModule", (m:any) => {{
        const tokenName = m.getParameter("_name", "{}");
        const tokenSymbol = m.getParameter("_symbol", "{}");
        const owner = m.getParameter("initialOwner","{}");
        const token = m.contract("MyToken",[owner,tokenName,tokenSymbol]);

        return {{ token }};
        }});

        module.exports = TokenModule;
    "#,
            token_name, symbol, address
        )
        .as_bytes(),
    )?;
    Ok(())
}
pub fn write_script()->String {
    // Change directory using current_dir() instead of cd command
    let output = Command::new("cmd")
        .current_dir("./src/smart_contract") // Setting the directory directly
        .args(["/C", "npm run compile"])
        .output()
        .expect("Failed to execute command");

    // Check if the command was executed successfully
    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        println!("Output: {}", stdout);
        let result = Command::new("cmd").current_dir("./src/smart_contract").args(["/C"," echo y | npx hardhat ignition deploy .\\ignition\\modules\\Token.ts --network sepolia --verify
        "]).output().expect("msg");
        if result.status.success() {

            println!("result:::::::::::::::::{}",String::from_utf8_lossy(&result.stdout));
            
            delete_folder_and_file().unwrap();
           if let Some(e) = extract_url(&String::from_utf8_lossy(&result.stdout)) {
            println!("result=={}",e);
               return e.to_string();
           } else {
            return  "deploy is failed ".to_string();
           }
        }else {
            return  "deploy is failed ".to_string();
        }
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        eprintln!("Error: {}", stderr);
        return  "deploy is failed ".to_string();
    }
}

fn delete_folder(path: &str) -> io::Result<()> {
    if fs::metadata(path).is_ok() {
        fs::remove_dir_all(path)?;
        println!("Folder '{}' and its contents deleted successfully.", path);
    } else {
        println!("Folder '{}' does not exist.", path);
    }
    Ok(())
}

fn delete_file(path: &str) -> io::Result<()> {
    if fs::metadata(path).is_ok() {
        fs::remove_file(path)?;
        println!("File '{}' deleted successfully.", path);
    } else {
        println!("File '{}' does not exist.", path);
    }
    Ok(())
}

fn delete_folder_and_file() -> io::Result<()> {
    let folders = [
        "./src/smart_contract/artifacts",
        "./src/smart_contract/cache",
        "./src/smart_contract/typechain-types",
        "./src/smart_contract/ignition/deployments",
    ];

    for folder in folders.iter() {
        delete_folder(folder)?;
    }

    let file_path = "./src/smart_contract/ignition/modules/Token.ts";
    delete_file(file_path)?;

    Ok(())
}

fn extract_url(input: &str) -> Option<&str> {
    let re = Regex::new(r"https://[^\s]+").unwrap();
    re.find(input).map(|m| m.as_str())
}
