// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title FlowCredIdentity
 * @dev Contrato para gerenciar identidades de usuários no flowCred.it
 */
contract FlowCredIdentity {
    enum Role { NONE, TOMADOR, AVALIADOR, BOTH }

    struct UserProfile {
        string did;
        string ipfsHash;
        Role role;
        uint256 registeredAt;
        uint256 updatedAt;
        bool isActive;
    }

    // Mapeamento de endereço para perfil de usuário
    mapping(address => UserProfile) public users;

    // Mapeamento de DID para endereço
    mapping(string => address) public didToAddress;

    event UserRegistered(address indexed userAddress, string did, string ipfsHash, Role role);
    event UserUpdated(address indexed userAddress, string ipfsHash, Role role);
    event UserDeactivated(address indexed userAddress);

    /**
     * @dev Registra um novo usuário
     * @param _did DID do usuário
     * @param _ipfsHash Hash IPFS do perfil do usuário
     * @param _role Papel do usuário (1=tomador, 2=avaliador, 3=ambos)
     */
    function registerUser(string memory _did, string memory _ipfsHash, uint8 _role) external {
        require(bytes(users[msg.sender].did).length == 0, "User already registered");
        require(_role > 0 && _role <= 3, "Invalid role");
        require(bytes(_did).length > 0, "DID cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(didToAddress[_did] == address(0), "DID already registered");

        Role role = Role(_role);

        users[msg.sender] = UserProfile({
            did: _did,
            ipfsHash: _ipfsHash,
            role: role,
            registeredAt: block.timestamp,
            updatedAt: block.timestamp,
            isActive: true
        });

        didToAddress[_did] = msg.sender;

        emit UserRegistered(msg.sender, _did, _ipfsHash, role);
    }

    /**
     * @dev Atualiza o perfil de um usuário existente
     * @param _ipfsHash Novo hash IPFS do perfil do usuário
     * @param _role Novo papel do usuário (1=tomador, 2=avaliador, 3=ambos)
     */
    function updateProfile(string memory _ipfsHash, uint8 _role) external {
        require(bytes(users[msg.sender].did).length > 0, "User not registered");
        require(_role > 0 && _role <= 3, "Invalid role");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");

        Role role = Role(_role);

        users[msg.sender].ipfsHash = _ipfsHash;
        users[msg.sender].role = role;
        users[msg.sender].updatedAt = block.timestamp;

        emit UserUpdated(msg.sender, _ipfsHash, role);
    }

    /**
     * @dev Desativa um usuário
     */
    function deactivateUser() external {
        require(bytes(users[msg.sender].did).length > 0, "User not registered");
        require(users[msg.sender].isActive, "User already deactivated");

        users[msg.sender].isActive = false;

        emit UserDeactivated(msg.sender);
    }

    /**
     * @dev Obtém o perfil de um usuário
     * @param _userAddress Endereço do usuário
     * @return did DID do usuário
     * @return ipfsHash Hash IPFS do perfil do usuário
     * @return role Papel do usuário
     * @return registeredAt Timestamp de registro
     * @return updatedAt Timestamp da última atualização
     * @return isActive Status de ativação do usuário
     */
    function getUserProfile(address _userAddress) external view returns (
        string memory did,
        string memory ipfsHash,
        Role role,
        uint256 registeredAt,
        uint256 updatedAt,
        bool isActive
    ) {
        UserProfile memory profile = users[_userAddress];
        return (
            profile.did,
            profile.ipfsHash,
            profile.role,
            profile.registeredAt,
            profile.updatedAt,
            profile.isActive
        );
    }

    /**
     * @dev Obtém o endereço associado a um DID
     * @param _did DID do usuário
     * @return Endereço associado ao DID
     */
    function getUserByDID(string memory _did) external view returns (address) {
        return didToAddress[_did];
    }

    /**
     * @dev Verifica se um usuário tem o papel de tomador
     * @param _userAddress Endereço do usuário
     * @return true se o usuário tem o papel de tomador
     */
    function isTomador(address _userAddress) external view returns (bool) {
        return users[_userAddress].isActive &&
               (users[_userAddress].role == Role.TOMADOR ||
                users[_userAddress].role == Role.BOTH);
    }

    /**
     * @dev Verifica se um usuário tem o papel de avaliador
     * @param _userAddress Endereço do usuário
     * @return true se o usuário tem o papel de avaliador
     */
    function isAvaliador(address _userAddress) external view returns (bool) {
        return users[_userAddress].isActive &&
               (users[_userAddress].role == Role.AVALIADOR ||
                users[_userAddress].role == Role.BOTH);
    }
}
