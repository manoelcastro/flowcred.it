// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/vc/FlowCredVCRegistry.sol";

contract FlowCredVCRegistryTest is Test {
    FlowCredVCRegistry public vcRegistry;
    address public owner = address(0x1);
    address public user = address(0x2);

    function setUp() public {
        vm.startPrank(owner);
        vcRegistry = new FlowCredVCRegistry();
        vm.stopPrank();
    }

    function testRegisterVC() public {
        vm.startPrank(user);
        
        string memory id = "vc:uuid:12345";
        string memory ipfsHash = "QmVCHash123456789";
        string memory subjectDid = "did:ethr:0x1234567890abcdef";
        string memory vcType = "RoleCredential";
        
        vcRegistry.registerVC(id, ipfsHash, subjectDid, vcType);
        
        (
            string memory storedId,
            string memory storedIpfsHash,
            string memory storedSubjectDid,
            string memory storedVcType,
            ,
            bool isRevoked
        ) = vcRegistry.getVCDetails(id);
        
        assertEq(storedId, id);
        assertEq(storedIpfsHash, ipfsHash);
        assertEq(storedSubjectDid, subjectDid);
        assertEq(storedVcType, vcType);
        assertFalse(isRevoked);
        
        vm.stopPrank();
    }
    
    function testRevokeVC() public {
        // Primeiro, registrar uma VC
        vm.startPrank(user);
        
        string memory id = "vc:uuid:12345";
        vcRegistry.registerVC(id, "ipfsHash", "did:ethr:subject", "RoleCredential");
        
        vm.stopPrank();
        
        // Agora, revogar a VC (apenas o owner pode fazer isso)
        vm.startPrank(owner);
        
        vcRegistry.revokeVC(id);
        
        vm.stopPrank();
        
        // Verificar se a VC foi revogada
        (
            ,
            ,
            ,
            ,
            ,
            bool isRevoked
        ) = vcRegistry.getVCDetails(id);
        
        assertTrue(isRevoked);
    }
    
    function testIsVCValid() public {
        // Registrar uma VC
        vm.startPrank(user);
        
        string memory id = "vc:uuid:12345";
        vcRegistry.registerVC(id, "ipfsHash", "did:ethr:subject", "RoleCredential");
        
        vm.stopPrank();
        
        // Verificar se a VC é válida
        assertTrue(vcRegistry.isVCValid(id));
        
        // Revogar a VC
        vm.startPrank(owner);
        vcRegistry.revokeVC(id);
        vm.stopPrank();
        
        // Verificar se a VC não é mais válida
        assertFalse(vcRegistry.isVCValid(id));
    }
    
    function testGetUserVCs() public {
        vm.startPrank(user);
        
        string memory subjectDid = "did:ethr:subject";
        
        // Registrar várias VCs para o mesmo sujeito
        vcRegistry.registerVC("vc:1", "ipfsHash1", subjectDid, "RoleCredential");
        vcRegistry.registerVC("vc:2", "ipfsHash2", subjectDid, "DocumentCredential");
        
        vm.stopPrank();
        
        // Obter todas as VCs do usuário
        string[] memory userVCs = vcRegistry.getUserVCs(subjectDid);
        
        assertEq(userVCs.length, 2);
        assertEq(userVCs[0], "vc:1");
        assertEq(userVCs[1], "vc:2");
    }
    
    function testFailRevokeVCNonOwner() public {
        // Registrar uma VC
        vm.startPrank(user);
        
        string memory id = "vc:uuid:12345";
        vcRegistry.registerVC(id, "ipfsHash", "did:ethr:subject", "RoleCredential");
        
        // Tentar revogar a VC como não-owner (deve falhar)
        vcRegistry.revokeVC(id);
        
        vm.stopPrank();
    }
}
