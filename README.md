# Documentação de Arquitetura e Estrutura da API Pública

## 1. Introdução

Este documento tem como objetivo definir a estrutura e a arquitetura inicial para a nova API pública da empresa, baseada na análise do repositório de referência `gclient-api`. A arquitetura proposta segue rigorosamente os princípios da **Clean Architecture** e do **Clean Domain**, garantindo um sistema robusto, testável, e com alta manutenibilidade.

## 2. Arquitetura Proposta: Clean Architecture e Clean Domain

A arquitetura do projeto é organizada em camadas concêntricas, onde a dependência flui sempre de fora para dentro. O núcleo (Domain) é independente de qualquer tecnologia de infraestrutura.

### Estrutura de Camadas

A estrutura de diretórios reflete diretamente as camadas da Clean Architecture:

| Camada                                    | Diretório    | Responsabilidade                                                                                                                                                                             | Princípios Chave                                   |
| :---------------------------------------- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| **Core Business Logic (Clean Domain)**    | `src/domain` | Contém as **Entidades** (objetos de negócio), **Use Cases** (regras de negócio específicas da aplicação) e **Interfaces** (contratos para a camada de Infraestrutura, como Repositórios).    | Independência de Frameworks, Regra de Dependência. |
| **Infraestrutura (Frameworks & Drivers)** | `src/infra`  | Contém a implementação de detalhes externos, como o servidor HTTP (**Fastify**), a conexão com o banco de dados (**Firebase Admin**) e a implementação das Interfaces definidas no `domain`. | Adaptação, Detalhes de Implementação.              |

**Clean Domain (`src/domain`):**
Esta é a camada mais interna e crucial. Ela contém o _coração_ da aplicação, as regras de negócio que não devem mudar, independentemente de como a API é exposta (HTTP, CLI, etc.) ou qual banco de dados é usado.

**Infraestrutura (`src/infra`):**
Esta camada atua como um adaptador. Ela traduz as requisições externas (HTTP) em chamadas para os **Use Cases** do `domain` e implementa as interfaces de persistência (Repositórios) para interagir com o mundo externo (Firebase, etc.).

## 3. Tecnologias Escolhidas

O projeto utiliza o ecossistema Node.js/TypeScript, escolhido pela sua performance, tipagem forte e vasta comunidade, o que se alinha com a necessidade de uma API pública eficiente e segura.

| Categoria                 | Tecnologia         | Justificativa                                                                                                                                                  |
| :------------------------ | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Linguagem**             | TypeScript         | Oferece tipagem estática, aumentando a segurança e a manutenibilidade do código, essencial para uma API pública.                                               |
| **Runtime**               | Node.js            | Alto desempenho em operações I/O, ideal para APIs.                                                                                                             |
| **Framework Web**         | Fastify            | Conhecido por ser um dos _frameworks_ mais rápidos para Node.js, garantindo baixa latência e alta vazão.                                                       |
| **Validação**             | Zod                | Biblioteca de validação de _schemas_ com foco em segurança de tipos (Type-Safe), integrada nativamente com TypeScript e Fastify (`fastify-type-provider-zod`). |
| **Persistência/Serviços** | Firebase Admin     | Utilizado para integração com serviços Firebase, como autenticação e/ou banco de dados (e.g., Firestore), provendo uma solução _serverless_ e escalável.       |
| **Autenticação**          | `@fastify/jwt`     | Implementação robusta de JWT para Fastify, suportando o modelo de autenticação stateless.                                                                      |
| **Documentação**          | `@fastify/swagger` | Geração automática de documentação OpenAPI (Swagger), crucial para o consumo da API pública por terceiros.                                                     |

## 4. Modelo de Autenticação: JWT (JSON Web Token)

O modelo de autenticação será baseado em **JSON Web Tokens (JWT)**, gerenciado pelo plugin `@fastify/jwt`.

### Fluxo Proposto

1.  **Login/Geração de Token:** O cliente envia credenciais (ou um token de autenticação de um provedor externo, como Firebase Auth) para um _endpoint_ de autenticação.
2.  **Validação:** O servidor valida as credenciais e, se bem-sucedido, gera um **Access Token** (JWT) e um **Refresh Token**.
3.  **Acesso à API:** O cliente inclui o **Access Token** no cabeçalho `Authorization` de cada requisição subsequente (padrão `Bearer`).
4.  **Verificação:** O Fastify, via `@fastify/jwt`, verifica a validade e a assinatura do token.
5.  **Refresh Token:** O **Refresh Token** é usado para obter um novo **Access Token** quando o atual expirar, minimizando o tempo de vida do **Access Token** e, consequentemente, o risco de segurança.

**Justificativa:** O JWT é _stateless_, o que significa que o servidor não precisa armazenar o estado da sessão, facilitando a escalabilidade horizontal da API.

## 5. Justificativas Estratégicas

### Justificativa da Arquitetura (Clean Architecture)

A escolha da Clean Architecture é estratégica para o sucesso a longo prazo da API pública:

- **Testabilidade:** As regras de negócio (Use Cases) são isoladas da infraestrutura, permitindo testes unitários rápidos e sem dependências externas (banco de dados, HTTP).
- **Manutenibilidade:** A separação de responsabilidades torna o código mais fácil de entender e modificar. Alterações na infraestrutura (ex: trocar Fastify por outro framework) não afetam o _domain_.
- **Independência:** O _domain_ é o centro, garantindo que a lógica de negócio permaneça pura e independente de detalhes técnicos.

### Justificativa das Tecnologias

- **TypeScript/Zod:** A combinação oferece um contrato de dados e tipagem forte desde a entrada da requisição até a lógica de negócio, prevenindo a maioria dos erros em tempo de compilação.
- **Fastify:** A performance superior é crucial para uma API pública de alta demanda, garantindo que a infraestrutura não seja o gargalo do sistema.
- **Firebase Admin:** Aproveita a infraestrutura de serviços gerenciados do Google, permitindo que a equipe se concentre na lógica de negócio principal em vez de gerenciar a infraestrutura de autenticação e persistência.
