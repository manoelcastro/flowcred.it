// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/identity/FlowCredIdentity.sol";

contract FlowCredIdentityTest is Test {
    FlowCredIdentity public identity;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        identity = new FlowCredIdentity();
    }

    function testRegisterUser() public {
        vm.startPrank(user1);
        
        string memory did = "did:ethr:0x1234567890abcdef";
        string memory ipfsHash = "QmXyZ123456789";
        uint8 role = 1; // TOMADOR
        
        identity.registerUser(did, ipfsHash, role);
        
        (
            string memory storedDid,
            string memory storedIpfsHash,
            FlowCredIdentity.Role storedRole,
            uint256 registeredAt,
            uint256 updatedAt,
            bool isActive
        ) = identity.getUserProfile(user1);
        
        assertEq(storedDid, did);
        assertEq(storedIpfsHash, ipfsHash);
        assertEq(uint8(storedRole), role);
        assertTrue(isActive);
        
        vm.stopPrank();
    }
    
    function testUpdateProfile() public {
        vm.startPrank(user1);
        
        // Primeiro, registrar o usuário
        string memory did = "did:ethr:0x1234567890abcdef";
        string memory ipfsHash = "QmXyZ123456789";
        uint8 role = 1; // TOMADOR
        
        identity.registerUser(did, ipfsHash, role);
        
        // Agora, atualizar o perfil
        string memory newIpfsHash = "QmNewHash123456789";
        uint8 newRole = 3; // BOTH
        
        identity.updateProfile(newIpfsHash, newRole);
        
        (
            string memory storedDid,
            string memory storedIpfsHash,
            FlowCredIdentity.Role storedRole,
            ,
            ,
            bool isActive
        ) = identity.getUserProfile(user1);
        
        assertEq(storedDid, did); // DID não muda
        assertEq(storedIpfsHash, newIpfsHash);
        assertEq(uint8(storedRole), newRole);
        assertTrue(isActive);
        
        vm.stopPrank();
    }
    
    function testDeactivateUser() public {
        vm.startPrank(user1);
        
        // Primeiro, registrar o usuário
        string memory did = "did:ethr:0x1234567890abcdef";
        string memory ipfsHash = "QmXyZ123456789";
        uint8 role = 1; // TOMADOR
        
        identity.registerUser(did, ipfsHash, role);
        
        // Agora, desativar o usuário
        identity.deactivateUser();
        
        (
            ,
            ,
            ,
            ,
            ,
            bool isActive
        ) = identity.getUserProfile(user1);
        
        assertFalse(isActive);
        
        vm.stopPrank();
    }
    
    function testIsTomador() public {
        vm.startPrank(user1);
        
        // Registrar usuário como tomador
        identity.registerUser("did:ethr:user1", "ipfsHash1", 1);
        
        vm.stopPrank();
        
        vm.startPrank(user2);
        
        // Registrar usuário como avaliador
        identity.registerUser("did:ethr:user2", "ipfsHash2", 2);
        
        vm.stopPrank();
        
        assertTrue(identity.isTomador(user1));
        assertFalse(identity.isTomador(user2));
    }
    
    function testIsAvaliador() public {
        vm.startPrank(user1);
        
        // Registrar usuário como tomador
        identity.registerUser("did:ethr:user1", "ipfsHash1", 1);
        
        vm.stopPrank();
        
        vm.startPrank(user2);
        
        // Registrar usuário como avaliador
        identity.registerUser("did:ethr:user2", "ipfsHash2", 2);
        
        vm.stopPrank();
        
        assertFalse(identity.isAvaliador(user1));
        assertTrue(identity.isAvaliador(user2));
    }
    
    function testGetUserByDID() public {
        vm.startPrank(user1);
        
        string memory did = "did:ethr:0x1234567890abcdef";
        identity.registerUser(did, "ipfsHash", 1);
        
        vm.stopPrank();
        
        address storedAddress = identity.getUserByDID(did);
        assertEq(storedAddress, user1);
    }
}
