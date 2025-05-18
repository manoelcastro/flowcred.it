// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/identity/FlowCredIdentity.sol";
import "../src/vc/FlowCredVCRegistry.sol";

contract DeployFlowCred is Script {
    function run() external {
        // Chave privada da primeira conta do Anvil
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Identity Contract
        FlowCredIdentity identity = new FlowCredIdentity();
        console.log("FlowCredIdentity deployed at:", address(identity));

        // Deploy VC Registry Contract
        FlowCredVCRegistry vcRegistry = new FlowCredVCRegistry();
        console.log("FlowCredVCRegistry deployed at:", address(vcRegistry));

        vm.stopBroadcast();
    }
}
