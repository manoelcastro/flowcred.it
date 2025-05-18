# Fluxo de Autenticação e Registro no flowCred.it

Este documento descreve o fluxo completo de autenticação via carteira, registro/login via smart contract e geração de Credenciais Verificáveis (VCs) no flowCred.it.

## Visão Geral do Fluxo

O processo de autenticação e registro no flowCred.it segue uma abordagem descentralizada, utilizando carteiras blockchain para autenticação, smart contracts para registro e gerenciamento de identidade, e IPFS/Pinata para armazenamento de dados e Credenciais Verificáveis.

## Fluxo Detalhado

### 1. Autenticação via Carteira

**Passo 1: Conexão da Carteira**
- Usuário clica no botão "Conectar Carteira" no navbar
- A aplicação solicita acesso à carteira (Talisman, MetaMask, etc.)
- Usuário autoriza a conexão
- A aplicação captura o endereço da carteira

**Passo 2: Verificação de Assinatura**
- A aplicação gera uma mensagem única com timestamp
- Solicita ao usuário assinar esta mensagem com sua carteira
- A assinatura comprova que o usuário controla a carteira
- Esta etapa é crucial para segurança e prevenção de ataques

### 2. Registro ou Login via Smart Contract

**Passo 3: Verificação de Registro Existente**
- A aplicação consulta o smart contract de identidade
- Verifica se o endereço da carteira já está registrado
- Se já registrado → Fluxo de Login
- Se não registrado → Fluxo de Registro

**Passo 4A: Fluxo de Registro (Novo Usuário)**
- Exibe modal de seleção de perfil (tomador/avaliador)
- Coleta informações básicas (nome, email)
- Cria um DID (Decentralized Identifier) para o usuário usando Veramo
- Armazena os dados do perfil no IPFS via Pinata
- Registra o hash IPFS e o DID no smart contract de identidade
- O smart contract emite um evento de registro

**Passo 4B: Fluxo de Login (Usuário Existente)**
- Recupera o hash IPFS do perfil do usuário do smart contract
- Busca os dados do perfil no IPFS
- Verifica se o usuário tem VCs válidas
- Carrega as preferências e configurações do usuário

### 3. Geração e Verificação de VCs

**Passo 5: Emissão de VCs Iniciais**
- Após registro bem-sucedido, o sistema emite VCs básicas:
  - VC de Identidade: confirma a identidade básica do usuário
  - VC de Papel: confirma o papel do usuário (tomador/avaliador/ambos)
- As VCs são criadas usando Veramo
- As VCs são armazenadas no IPFS via Pinata
- Os hashes IPFS das VCs são registrados no smart contract de VCs

**Passo 6: Redirecionamento para Dashboard**
- Com base no papel selecionado/verificado, o usuário é redirecionado:
  - Tomador de crédito → Dashboard do tomador
  - Avaliador de crédito → Dashboard do avaliador
  - Ambos → Dashboard do papel selecionado no modal

## Componentes do Sistema

### Smart Contracts

**1. Contrato de Identidade**
- Armazena mapeamento de endereços para DIDs
- Armazena referências (hashes IPFS) para perfis de usuários
- Gerencia papéis de usuários (tomador/avaliador/ambos)
- Funções principais:
  - Registrar novo usuário
  - Atualizar perfil de usuário
  - Verificar papel de usuário
  - Obter referência ao perfil do usuário

**2. Contrato de Registro de VCs**
- Armazena referências (hashes IPFS) para VCs
- Mantém mapeamento de DIDs para VCs
- Gerencia status de VCs (válida/revogada)
- Funções principais:
  - Registrar nova VC
  - Revogar VC existente
  - Verificar validade de VC
  - Listar VCs de um usuário

### Serviços da Aplicação

**1. Serviço de Autenticação**
- Gerencia conexão com carteiras via viem
- Lida com assinaturas e verificação
- Mantém estado de autenticação na aplicação

**2. Serviço de Identidade**
- Interage com o contrato de identidade
- Gerencia criação e atualização de perfis
- Armazena e recupera dados do IPFS via Pinata

**3. Serviço de VCs (com Veramo)**
- Cria e gerencia DIDs
- Emite, armazena e verifica VCs
- Interage com o contrato de registro de VCs

**4. Serviço de IPFS (com Pinata)**
- Gerencia upload e pinning de dados no IPFS
- Recupera dados do IPFS
- Mantém cache local para acesso rápido

## Fluxos Específicos

### Fluxo de Mudança de Papel

1. Usuário solicita mudança/adição de papel
2. Sistema verifica elegibilidade
3. Se aprovado, emite nova VC de papel
4. Atualiza registro no smart contract
5. Usuário agora pode alternar entre dashboards

### Fluxo de Upload de Documento (Tomador)

1. Usuário faz upload de documento
2. Documento é armazenado no IPFS via Pinata
3. Hash IPFS é registrado no smart contract
4. Sistema emite VC de propriedade do documento
5. Documento aparece no dashboard do tomador

### Fluxo de Avaliação de Crédito (Avaliador)

1. Avaliador cria fluxo de avaliação
2. Define parâmetros e critérios
3. Sistema registra fluxo no IPFS via Pinata
4. Hash IPFS é registrado no smart contract
5. Sistema emite VC de propriedade do fluxo

### Fluxo de Consentimento para Avaliação

1. Tomador visualiza solicitação de avaliação
2. Concede consentimento para uso de documentos específicos
3. Sistema registra consentimento no IPFS via Pinata
4. Hash IPFS é registrado no smart contract
5. Sistema emite VC de consentimento
6. Avaliador recebe acesso aos documentos aprovados

## Vantagens desta Abordagem

1. **Totalmente Descentralizada**: Autenticação via carteira, armazenamento via IPFS, lógica via smart contracts
2. **Privacidade Preservada**: Dados sensíveis armazenados off-chain, apenas referências on-chain
3. **Verificabilidade**: VCs fornecem provas verificáveis de atributos e permissões
4. **Flexibilidade de Papéis**: Suporte nativo para usuários com múltiplos papéis
5. **Auditabilidade**: Todas as ações importantes são registradas na blockchain
6. **Interoperabilidade**: Uso de padrões abertos (DIDs, VCs, IPFS) facilita integração com outros sistemas

## Considerações de Implementação

1. **UX Fluida**: Apesar da complexidade técnica, a experiência do usuário deve ser simples e intuitiva
2. **Gerenciamento de Estado**: Implementar caching local para reduzir latência de acesso ao IPFS
3. **Recuperação de Conta**: Implementar mecanismo para usuários que perdem acesso à carteira
4. **Escalabilidade**: Considerar soluções L2 para reduzir custos de transação
5. **Compatibilidade de Carteiras**: Garantir suporte para diversas carteiras, com foco em Talisman

## Diagrama de Sequência

```
┌─────────┐          ┌─────────┐          ┌──────────┐          ┌─────────┐          ┌─────────┐
│ Usuário │          │ Frontend│          │Smart     │          │ Veramo  │          │ IPFS/   │
│         │          │         │          │Contracts │          │         │          │ Pinata  │
└────┬────┘          └────┬────┘          └────┬─────┘          └────┬────┘          └────┬────┘
     │    Conectar        │                    │                     │                     │
     │    Carteira        │                    │                     │                     │
     │ ─────────────────> │                    │                     │                     │
     │                    │                    │                     │                     │
     │    Solicitar       │                    │                     │                     │
     │    Assinatura      │                    │                     │                     │
     │ <───────────────── │                    │                     │                     │
     │                    │                    │                     │                     │
     │    Assinar         │                    │                     │                     │
     │    Mensagem        │                    │                     │                     │
     │ ─────────────────> │                    │                     │                     │
     │                    │                    │                     │                     │
     │                    │  Verificar         │                     │                     │
     │                    │  Registro          │                     │                     │
     │                    │ ──────────────────>│                     │                     │
     │                    │                    │                     │                     │
     │                    │  Resposta          │                     │                     │
     │                    │ <──────────────────│                     │                     │
     │                    │                    │                     │                     │
     │  Modal Seleção     │                    │                     │                     │
     │  de Perfil         │                    │                     │                     │
     │ <───────────────── │                    │                     │                     │
     │                    │                    │                     │                     │
     │  Enviar Dados      │                    │                     │                     │
     │  do Perfil         │                    │                     │                     │
     │ ─────────────────> │                    │                     │                     │
     │                    │                    │                     │                     │
     │                    │                    │                     │                     │
     │                    │  Criar DID         │                     │                     │
     │                    │ ───────────────────────────────────────> │                     │
     │                    │                    │                     │                     │
     │                    │  DID Criado        │                     │                     │
     │                    │ <─────────────────────────────────────── │                     │
     │                    │                    │                     │                     │
     │                    │  Armazenar         │                     │                     │
     │                    │  Perfil            │                     │                     │
     │                    │ ─────────────────────────────────────────────────────────────> │
     │                    │                    │                     │                     │
     │                    │  IPFS Hash         │                     │                     │
     │                    │ <───────────────────────────────────────────────────────────── │
     │                    │                    │                     │                     │
     │                    │  Registrar         │                     │                     │
     │                    │  Usuário           │                     │                     │
     │                    │ ──────────────────>│                     │                     │
     │                    │                    │                     │                     │
     │                    │  Emitir VC         │                     │                     │
     │                    │ ───────────────────────────────────────> │                     │
     │                    │                    │                     │                     │
     │                    │  VC Criada         │                     │                     │
     │                    │ <─────────────────────────────────────── │                     │
     │                    │                    │                     │                     │
     │                    │  Armazenar VC      │                     │                     │
     │                    │ ─────────────────────────────────────────────────────────────> │
     │                    │                    │                     │                     │
     │                    │  IPFS Hash         │                     │                     │
     │                    │ <───────────────────────────────────────────────────────────── │
     │                    │                    │                     │                     │
     │                    │  Registrar VC      │                     │                     │
     │                    │ ──────────────────>│                     │                     │
     │                    │                    │                     │                     │
     │  Redirecionamento  │                    │                     │                     │
     │  para Dashboard    │                    │                     │                     │
     │ <───────────────── │                    │                     │                     │
     │                    │                    │                     │                     │
┌────┴────┐          ┌────┴────┐          ┌────┴─────┐          ┌────┴────┐          ┌────┴────┐
│ Usuário │          │ Frontend│          │Smart     │          │ Veramo  │          │ IPFS/   │
│         │          │         │          │Contracts │          │         │          │ Pinata  │
└─────────┘          └─────────┘          └──────────┘          └─────────┘          └─────────┘
```

## Conclusão

Este fluxo de autenticação e registro proporciona uma base sólida para o flowCred.it, combinando autenticação via carteira, registro via smart contract e o poder das Credenciais Verificáveis, tudo armazenado de forma descentralizada via IPFS/Pinata.
