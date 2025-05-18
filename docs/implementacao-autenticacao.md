# Implementação do Fluxo de Autenticação e Registro no flowCred.it

Este documento descreve a implementação do fluxo de autenticação e registro no flowCred.it, usando Foundry para os smart contracts e Next.js com Viem para o frontend.

## Estrutura da Implementação

A implementação está dividida em duas partes principais:

1. **Smart Contracts (Foundry)**: Contratos para gerenciar identidade e VCs
2. **Frontend (Next.js + Viem)**: Interface e integração com os contratos

## Smart Contracts

### Contratos Implementados

1. **FlowCredIdentity.sol**
   - Gerencia a identidade dos usuários
   - Armazena mapeamento de endereços para DIDs
   - Gerencia papéis (tomador/avaliador/ambos)
   - Armazena referências IPFS para perfis

2. **FlowCredVCRegistry.sol**
   - Gerencia o registro de Credenciais Verificáveis
   - Armazena referências IPFS para VCs
   - Permite verificação de VCs

### Compilação e Deploy

Para compilar e fazer deploy dos contratos:

```bash
# Navegar para o diretório web3
cd web3

# Compilar os contratos
forge build

# Fazer deploy dos contratos (testnet)
forge script script/DeployFlowCred.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

Após o deploy, atualize os endereços dos contratos no arquivo `frontend-flowcred/src/lib/contracts/addresses.ts`.

## Frontend

### Serviços Implementados

1. **PinataService**
   - Gerencia upload e download de dados no IPFS via Pinata
   - Armazena perfis de usuários e VCs

2. **IdentityService**
   - Interage com o contrato FlowCredIdentity
   - Gerencia registro e atualização de perfis
   - Verifica papéis de usuários

3. **VCService**
   - Emite e verifica Credenciais Verificáveis
   - Interage com o contrato FlowCredVCRegistry

### Componentes Atualizados

1. **RoleSelectionModal**
   - Atualizado para registrar usuários no contrato
   - Emite VCs de papel após registro

2. **WalletContext**
   - Atualizado para integrar com os serviços
   - Gerencia atualização de perfil via contrato

3. **RouteGuard**
   - Atualizado para verificar papéis no contrato
   - Redireciona com base no papel verificado

## Fluxo de Autenticação e Registro

### 1. Conexão da Carteira

1. Usuário clica no botão "Conectar Carteira"
2. A aplicação solicita acesso à carteira (Talisman, MetaMask, etc.)
3. Usuário autoriza a conexão
4. A aplicação captura o endereço da carteira

### 2. Verificação de Registro

1. A aplicação verifica se o endereço já está registrado no contrato
2. Se já registrado → Fluxo de Login
3. Se não registrado → Fluxo de Registro

### 3. Fluxo de Registro (Novo Usuário)

1. Exibe modal de seleção de perfil (tomador/avaliador)
2. Coleta informações básicas (nome, email)
3. Gera um DID para o usuário
4. Armazena os dados do perfil no IPFS via Pinata
5. Registra o hash IPFS e o DID no contrato FlowCredIdentity
6. Emite uma VC de papel para o usuário
7. Redireciona para o dashboard correspondente

### 4. Fluxo de Login (Usuário Existente)

1. Recupera o hash IPFS do perfil do usuário do contrato
2. Busca os dados do perfil no IPFS
3. Verifica se o usuário tem VCs válidas
4. Redireciona para o dashboard correspondente

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example` em cada diretório:

1. **Frontend**
   - Endereços dos contratos
   - Chaves de API do Pinata
   - RPC URLs

2. **Web3**
   - Chave privada para deploy
   - RPC URLs
   - Etherscan API Key

## Testes

### Testes dos Smart Contracts

```bash
# Navegar para o diretório web3
cd web3

# Executar testes
forge test
```

### Testes do Frontend

```bash
# Navegar para o diretório frontend-flowcred
cd frontend-flowcred

# Executar testes
npm test
```

## Considerações de Segurança

1. **Proteção de Chaves Privadas**: Nunca exponha chaves privadas no código ou repositório.
2. **Validação de Assinaturas**: Implemente verificação de assinaturas para garantir que apenas o proprietário da carteira possa modificar seu perfil.
3. **Proteção contra Ataques de Replay**: Use nonces ou timestamps para evitar ataques de replay.
4. **Auditoria de Contratos**: Realize auditorias de segurança nos contratos antes do deploy em produção.

## Próximos Passos

1. **Implementação de ZK-proofs**: Adicionar suporte para provas zero-knowledge para melhorar a privacidade.
2. **Integração com Veramo**: Implementar a integração completa com Veramo para gerenciamento de DIDs e VCs.
3. **Suporte para Múltiplas Chains**: Adicionar suporte para mais chains além de Ethereum.
4. **Mecanismo de Recuperação**: Implementar um mecanismo de recuperação de conta para usuários que perdem acesso às suas carteiras.
