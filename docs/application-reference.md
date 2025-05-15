📘 Contexto da Aplicação – flowCred.it

🧭 Visão Geral

flowCred.it é uma aplicação descentralizada de avaliação de crédito que permite que empresas e indivíduos compartilhem apenas as informações necessárias — de forma auditável e com privacidade garantida — com instituições que avaliam e concedem crédito. O projeto se baseia em autocustódia de documentos, provas de conhecimento zero (ZKProofs), credenciais verificáveis (VC/VP), e fluxos de validação configuráveis no estilo no-code.

👥 Perfis de Usuário

1. Tomador de Crédito

Armazena documentos sob custódia própria (wallet).

Conecta dados de diversas fontes (open finance, birôs, documentos fiscais).

Gera VC/VP e provas ZK com base nos dados coletados.

Autoriza, via consentimento granular, o compartilhamento seletivo de informações com avaliadores.

2. Avaliador de Crédito

Define quais métricas e provas deseja receber.

Constrói flows de avaliação (no-code) baseados em blocos.

Recebe e processa apenas as métricas e provas autorizadas.

Pode simular jornadas com base em critérios configuráveis (ex: valor de crédito).

🧩 Tecnologias Utilizadas

Frontend (Next.js + React)

Next.js (App Router)

TailwindCSS + Shadcn UI

Wagmi, Viem, Ethers.js – integração com carteira Ethereum

React Flow – para construção visual de fluxos de avaliação

Lit Protocol SDK – autenticação e wallet abstrata

Backend e Middleware

Node.js + Veramo – criação e gerenciamento de DID/VC/VP

zkVerify – verificação e geração de provas ZK

CrewAI – coordenação de agentes IA validadores por tipo de documento/conector

Belvo, Serasa, Receita Federal, etc. – integração com APIs externas

Armazenamento

IPFS ou Lit Protocol para armazenamento criptografado dos documentos

PostgreSQL + Prisma – metadados, fluxos, registros de consentimento

🔐 Autenticação (via Lit Protocol)

O usuário pode se conectar de duas formas:

Com carteira Ethereum tradicional (MetaMask, WalletConnect)

Via login social (Google, Discord, etc.) usando Lit + OAuth

Neste caso, uma carteira abstrata é criada automaticamente e vinculada ao DID do usuário

As chaves privadas são protegidas com Lit Actions e acessadas via sessão autorizada

A sessão Lit autentica o usuário por meio de assinatura criptográfica (wallet ou OAuth token)

O DID é gerado e mantido com base na chave da carteira (tradicional ou abstrata)

Todo o restante do sistema opera com base nessa identidade descentralizada

📥 Upload de Documentos / Conectores

Usuário adiciona documentos ou autoriza conectores (Belvo, birôs, etc.)

Agente IA (via CrewAI) analisa a origem e tipo do dado

Métricas são derivadas automaticamente e vinculadas ao DID como VC/VP

🧠 Painel de Métricas Derivadas

Mostra ao usuário o “score de contexto atual”

Informa quais métricas estão disponíveis, verificadas e com provas ZK

Serve como base para simulações e análises futuras

🧱 Avaliação via Fluxos

Avaliadores constroem “flows” com blocos de métricas/provas exigidas

Os flows podem ser personalizados por tipo de crédito ou valor solicitado

Os solicitantes recebem notificações e autorizam ou negam acesso

Apenas as provas (e não os dados brutos) são acessadas sempre que possível

📊 Relacionamento Documento ↔ Métricas

Documento / Fonte

Métricas Derivadas

Contrato Social

Capital Social, Fundadores, CNPJ Ativo

DRE

Receita, Lucro, Margens

Balanço Patrimonial

Ativos, Passivos, Endividamento

Certidões Negativas

Situação Fiscal e Regularidade

Birôs (Serasa, Boa Vista)

Score, Pendências, Protestos

Open Finance (Belvo)

Saldo, Fluxo de Caixa, Comportamento Financeiro

OCR (extratos, boletos)

Padrões de pagamento, recorrência, inadimplência

🚀 Evoluções Futuras

Financiamento descentralizado para compras

Possibilitar que fornecedores recebam à vista enquanto tomadores pagam faturado.

Implementar contrato inteligente de financiamento conectado ao fluxo de aprovação.

Atuar como intermediador confiável para liquidação e compensação entre partes.

Emissão de boletos pela plataforma

Permitir que o tomador gere boletos vinculados às transações aprovadas.

Monitorar pagamento ou inadimplência desses boletos.

Converter o histórico de pagamentos em novas Verifiable Credentials (VCs), enriquecendo o perfil de crédito.

Utilizar essas novas credenciais como parâmetros para avaliações futuras.

Este documento oferece o contexto necessário para qualquer ferramenta de desenvolvimento entender as responsabilidades, integrações e funcionalidades esperadas do sistema flowCred.it.

