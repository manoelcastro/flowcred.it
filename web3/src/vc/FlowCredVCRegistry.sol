// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title FlowCredVCRegistry
 * @dev Contrato para gerenciar o registro de Credenciais Verificáveis (VCs) no flowCred.it
 */
contract FlowCredVCRegistry {
    address public owner;

    struct VC {
        string id;
        string ipfsHash;
        string subjectDid;
        string vcType;
        uint256 issuedAt;
        bool isRevoked;
    }

    // Mapeamento de ID da VC para detalhes da VC
    mapping(string => VC) public vcs;

    // Mapeamento de DID para IDs de VCs
    mapping(string => string[]) public userVCs;

    event VCRegistered(string id, string ipfsHash, string subjectDid, string vcType);
    event VCRevoked(string id);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev Registra uma nova Credencial Verificável
     * @param _id ID único da VC
     * @param _ipfsHash Hash IPFS da VC
     * @param _subjectDid DID do sujeito da VC
     * @param _vcType Tipo da VC (ex: "RoleCredential", "DocumentVerificationCredential")
     */
    function registerVC(
        string memory _id,
        string memory _ipfsHash,
        string memory _subjectDid,
        string memory _vcType
    ) external {
        require(bytes(_id).length > 0, "VC ID cannot be empty");
        require(bytes(vcs[_id].id).length == 0, "VC already registered");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(_subjectDid).length > 0, "Subject DID cannot be empty");

        vcs[_id] = VC({
            id: _id,
            ipfsHash: _ipfsHash,
            subjectDid: _subjectDid,
            vcType: _vcType,
            issuedAt: block.timestamp,
            isRevoked: false
        });

        userVCs[_subjectDid].push(_id);

        emit VCRegistered(_id, _ipfsHash, _subjectDid, _vcType);
    }

    /**
     * @dev Revoga uma Credencial Verificável
     * @param _id ID da VC a ser revogada
     */
    function revokeVC(string memory _id) external onlyOwner {
        require(bytes(vcs[_id].id).length > 0, "VC not found");
        require(!vcs[_id].isRevoked, "VC already revoked");

        vcs[_id].isRevoked = true;

        emit VCRevoked(_id);
    }

    /**
     * @dev Verifica se uma VC é válida
     * @param _id ID da VC
     * @return true se a VC existe e não está revogada
     */
    function isVCValid(string memory _id) external view returns (bool) {
        return bytes(vcs[_id].id).length > 0 && !vcs[_id].isRevoked;
    }

    /**
     * @dev Obtém todas as VCs de um usuário
     * @param _did DID do usuário
     * @return Array de IDs de VCs do usuário
     */
    function getUserVCs(string memory _did) external view returns (string[] memory) {
        return userVCs[_did];
    }

    /**
     * @dev Obtém os detalhes de uma VC
     * @param _id ID da VC
     * @return id ID da VC
     * @return ipfsHash Hash IPFS da VC
     * @return subjectDid DID do sujeito da VC
     * @return vcType Tipo da VC
     * @return issuedAt Timestamp de emissão
     * @return isRevoked Status de revogação
     */
    function getVCDetails(string memory _id) external view returns (
        string memory id,
        string memory ipfsHash,
        string memory subjectDid,
        string memory vcType,
        uint256 issuedAt,
        bool isRevoked
    ) {
        VC memory vc = vcs[_id];
        return (
            vc.id,
            vc.ipfsHash,
            vc.subjectDid,
            vc.vcType,
            vc.issuedAt,
            vc.isRevoked
        );
    }
}
