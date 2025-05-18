#!/bin/bash

# Script para testar o fluxo de autenticação e registro com Anvil

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para exibir mensagens
log() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Verificar se o Foundry está instalado
if ! command -v anvil &> /dev/null; then
  error "Foundry não está instalado. Por favor, instale-o primeiro: https://book.getfoundry.sh/getting-started/installation"
fi

# Iniciar o Anvil em segundo plano
log "Iniciando o Anvil..."
anvil --silent > anvil.log 2>&1 &
ANVIL_PID=$!

# Garantir que o Anvil seja encerrado quando o script terminar
trap "kill $ANVIL_PID 2>/dev/null || true" EXIT

# Aguardar o Anvil iniciar
sleep 2

# Verificar se o Anvil está rodando
if ! curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545 > /dev/null; then
  error "Anvil não está rodando. Verifique o arquivo anvil.log para mais detalhes."
fi

log "Anvil iniciado com sucesso!"

# Obter a primeira chave privada do Anvil
PRIVATE_KEY=$(grep -o "Private Keys.*" anvil.log | head -1 | awk '{print $3}')

if [ -z "$PRIVATE_KEY" ]; then
  error "Não foi possível obter a chave privada do Anvil."
fi

# Fazer deploy dos contratos
log "Fazendo deploy dos contratos..."
DEPLOY_OUTPUT=$(forge script script/DeployFlowCred.s.sol --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY --broadcast 2>&1)

# Extrair endereços dos contratos
IDENTITY_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "FlowCredIdentity deployed at:" | awk '{print $4}')
VC_REGISTRY_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "FlowCredVCRegistry deployed at:" | awk '{print $4}')

if [ -z "$IDENTITY_ADDRESS" ] || [ -z "$VC_REGISTRY_ADDRESS" ]; then
  error "Não foi possível obter os endereços dos contratos. Verifique o output do deploy."
fi

log "Contratos implantados com sucesso!"
log "FlowCredIdentity: $IDENTITY_ADDRESS"
log "FlowCredVCRegistry: $VC_REGISTRY_ADDRESS"

# Criar arquivo .env.local para o frontend
log "Criando arquivo .env.local para o frontend..."
cat > ../frontend-flowcred/.env.local << EOL
NEXT_PUBLIC_IDENTITY_CONTRACT_ADDRESS=$IDENTITY_ADDRESS
NEXT_PUBLIC_VC_REGISTRY_CONTRACT_ADDRESS=$VC_REGISTRY_ADDRESS
NEXT_PUBLIC_ETHEREUM_RPC_URL=http://localhost:8545
EOL

log "Arquivo .env.local criado com sucesso!"

# Obter o endereço da primeira conta do Anvil
ACCOUNT_ADDRESS=$(grep -o "Account #0.*" anvil.log | head -1 | awk '{print $3}')

if [ -z "$ACCOUNT_ADDRESS" ]; then
  error "Não foi possível obter o endereço da conta do Anvil."
fi

log "Conta de teste: $ACCOUNT_ADDRESS"
log "Chave privada: $PRIVATE_KEY"

# Testar o registro de um usuário
log "Testando o registro de um usuário..."

# Criar um DID para o usuário
DID="did:flowcred:$ACCOUNT_ADDRESS:test"

# Criar um hash IPFS fictício
IPFS_HASH="QmTest123456789"

# Registrar o usuário como tomador
ROLE=1 # 1 = tomador, 2 = avaliador, 3 = ambos

log "Registrando usuário com DID: $DID, IPFS Hash: $IPFS_HASH, Role: $ROLE"
cast send $IDENTITY_ADDRESS "registerUser(string,string,uint8)" "$DID" "$IPFS_HASH" "$ROLE" --private-key $PRIVATE_KEY --rpc-url http://localhost:8545

# Verificar se o usuário foi registrado
log "Verificando se o usuário foi registrado..."
USER_PROFILE=$(cast call $IDENTITY_ADDRESS "getUserProfile(address)" $ACCOUNT_ADDRESS --rpc-url http://localhost:8545)

if [[ $USER_PROFILE == *"$DID"* ]]; then
  log "Usuário registrado com sucesso!"
else
  error "Falha ao registrar o usuário."
fi

# Verificar se o usuário é tomador
log "Verificando se o usuário é tomador..."
IS_TOMADOR=$(cast call $IDENTITY_ADDRESS "isTomador(address)" $ACCOUNT_ADDRESS --rpc-url http://localhost:8545)

if [[ $IS_TOMADOR == "true" ]]; then
  log "Usuário é tomador!"
else
  error "Usuário não é tomador, mas deveria ser."
fi

# Emitir uma VC para o usuário
log "Emitindo uma VC para o usuário..."
VC_ID="vc:uuid:test123"
VC_TYPE="RoleCredential"

cast send $VC_REGISTRY_ADDRESS "registerVC(string,string,string,string)" "$VC_ID" "$IPFS_HASH" "$DID" "$VC_TYPE" --private-key $PRIVATE_KEY --rpc-url http://localhost:8545

# Verificar se a VC foi registrada
log "Verificando se a VC foi registrada..."
VC_DETAILS=$(cast call $VC_REGISTRY_ADDRESS "getVCDetails(string)" "$VC_ID" --rpc-url http://localhost:8545)

if [[ $VC_DETAILS == *"$DID"* ]]; then
  log "VC registrada com sucesso!"
else
  error "Falha ao registrar a VC."
fi

# Verificar se a VC é válida
log "Verificando se a VC é válida..."
IS_VC_VALID=$(cast call $VC_REGISTRY_ADDRESS "isVCValid(string)" "$VC_ID" --rpc-url http://localhost:8545)

if [[ $IS_VC_VALID == "true" ]]; then
  log "VC é válida!"
else
  error "VC não é válida, mas deveria ser."
fi

# Obter VCs do usuário
log "Obtendo VCs do usuário..."
USER_VCS=$(cast call $VC_REGISTRY_ADDRESS "getUserVCs(string)" "$DID" --rpc-url http://localhost:8545)

if [[ $USER_VCS == *"$VC_ID"* ]]; then
  log "VCs do usuário obtidas com sucesso!"
else
  error "Falha ao obter VCs do usuário."
fi

log "Todos os testes passaram com sucesso!"
log "Agora você pode iniciar o frontend e testar o fluxo completo:"
log "cd ../frontend-flowcred && npm run dev"
log "Acesse http://localhost:3000 e conecte o MetaMask à rede Anvil (localhost:8545, Chain ID: 31337)"
log "Importe a conta de teste usando a chave privada: $PRIVATE_KEY"

# Manter o Anvil rodando
log "Anvil está rodando. Pressione Ctrl+C para encerrar."
wait $ANVIL_PID
