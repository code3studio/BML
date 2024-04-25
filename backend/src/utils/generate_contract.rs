use std::fmt::Error;
use std::fs::File;
use std::io::prelude::*;
use std::process::Command;

pub fn generate_contract() -> std::io::Result<()> {
    // Create a new file named "example.sol"
    println!("hi");
    let mut file = File::create("./src/smart_contract/contracts/MyExample.sol")?;

    // Write some content to the file
    file.write_all(
        b"
    //SPDX-License-Identifier: UNLICENSED
    \n
    // Solidity files have to start with this pragma.\n
    // It will be used by the Solidity compiler to validate its version.\n
    pragma solidity ^0.8.0;\n
    
    
    // This is the main building block for smart contracts.\n
    contract Token {\n
        // Some string type variables to identify the token.\n
        string public name = \"My Hardhat Token\";\n
        string public symbol = \"MHT\";\n
    
        // The fixed amount of tokens, stored in an unsigned integer type variable.\n
        uint256 public totalSupply = 1000000;\n
    
        // An address type variable is used to store ethereum accounts.\n
        address public owner;\n
    
        // A mapping is a key/value map. Here we store each account's balance.\n
        mapping(address => uint256) balances;\n
    
        // The Transfer event helps off-chain applications understand\n
        // what happens within your contract.\n
        event Transfer(address indexed _from, address indexed _to, uint256 _value);\n
    
        /**\n
         * Contract initialization.\n
         */\n
        constructor() {\n
            // The totalSupply is assigned to the transaction sender, which is the\n
            // account that is deploying the contract.\n
            balances[msg.sender] = totalSupply;\n
            owner = msg.sender;\n
        }
    
        /**\n
         * A function to transfer tokens.\n
         *\n
         * The `external` modifier makes a function *only* callable from *outside*\n
         * the contract.\n
         */\n\n
        function transfer(address to, uint256 amount) external {\n
            // Check if the transaction sender has enough tokens.\n
            // If `require`'s first argument evaluates to `false` then the\n
            // transaction will revert.\n
            require(balances[msg.sender] >= amount, \"Not enough tokens\");\n
    
            // Transfer the amount.\n
            balances[msg.sender] -= amount;\n
            balances[to] += amount;\n
    
            // Notify off-chain applications of the transfer.\n
            emit Transfer(msg.sender, to, amount);\n
        }
    
        /**\n
         * Read only function to retrieve the token balance of a given account.\n
         *\n
         * The `view` modifier indicates that it doesn't modify the contract's\n
         * state, which allows us to call it without executing a transaction.\n
         */\n
        function balanceOf(address account) external view returns (uint256) {\n
            return balances[account];\n
        }\n
    }\n

    ",
    )?;

    println!("File 'example.sol' created successfully!");
    write_script();
    Ok(())
}

pub fn write_script() {
    // Change directory using current_dir() instead of cd command
    let output = Command::new("cmd")
        .current_dir("./src/smart_contract") // Setting the directory directly
        .args(["/C","npm run compile"])
        .output()
        .expect("Failed to execute command");

    // Check if the command was executed successfully
    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        // println!("Output: {}", stdout);
        let result = Command::new("cmd").current_dir("./src/smart_contract").args(["/C"," echo y | npx hardhat ignition deploy .\\ignition\\modules\\Lock.ts --network sepolia --verify
        "]).output().expect("msg");
        if result.status.success() {
            
            // println!("result:::::::::::::::::{}",String::from_utf8_lossy(&result.));
        }
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        eprintln!("Error: {}", stderr);
    }
}
