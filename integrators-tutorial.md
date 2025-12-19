# Guia Rápido de Integração: API Pública

## Documentação dos endpoints

Acesse: https://gclient-api.vercel.app/docs

## 1. Visão Geral da Autenticação

A API Pública utiliza o padrão **JSON Web Token (JWT)**, também conhecido como **Bearer Token**, para autenticar todas as requisições a _endpoints_ protegidos. O processo de integração é dividido em três etapas principais:

1.  Obter o **Access Token** e o **Refresh Token**.
2.  Usar o **Access Token** no cabeçalho `Authorization` para acessar os recursos.
3.  Renovar o **Access Token** quando ele expirar, utilizando o **Refresh Token**.

## 2. Passo 1: Geração do Access Token

Para iniciar a comunicação com a API, você deve gerar um par de tokens enviando suas credenciais para o _endpoint_ de autenticação.

| Detalhe                 | Informação                 |
| :---------------------- | :------------------------- |
| **Método**              | `POST`                     |
| **Endpoint**            | `/v1/oauth/token`          |
| **Corpo da Requisição** | JSON contendo `clientId` . |

**`clientId` para Testes:** `fb65e109-c50f-4ad0-8908-b2ebb9dd716a`

**Exemplo de Requisição (cURL):**

```bash
curl -X POST 'https://gclient-api.vercel.app/v1/oauth/token' \
-H 'Content-Type: application/json' \
-d '{
    "clientId": "fb65e109-c50f-4ad0-8908-b2ebb9dd716a",
}'
```

**Resposta de Sucesso (Status 200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 3. Passo 2: Autenticação e Teste de Conexão

Após obter o `accessToken`, ele deve ser enviado no cabeçalho `Authorization` de todas as requisições subsequentes.

### Como Autenticar

O formato do cabeçalho deve ser: `Authorization: Bearer <SEU_ACCESS_TOKEN>`.

### Endpoint de Teste (Ping/Verificação)

Para verificar se o seu `accessToken` está válido e se a conexão com a API está funcionando, utilize o _endpoint_ de _ping_ para verificação.

| Detalhe       | Informação                                            |
| :------------ | :---------------------------------------------------- |
| **Método**    | `GET`                                                 |
| **Endpoint**  | `/v1/ping`                                            |
| **Requisito** | **Access Token** válido no cabeçalho `Authorization`. |

**Exemplo de Requisição (cURL):**

```bash
curl -X POST 'https://gclient-api.vercel.app/v1/ping' \
-H 'Authorization: Bearer SEU_ACCESS_TOKEN'
```

**Resposta de Sucesso (Status 200 OK):**

Se o token for válido, a API retornará uma confirmação:

```json
{
  "message": "Pong"
}
```

**Resposta de Falha (Status 401 Unauthorized):**

Se o token estiver ausente, inválido ou expirado, a requisição falhará com um erro de não autorizado.

## 4. Passo 3: Renovação do Access Token (Refresh)

O `accessToken` possui um tempo de vida limitado (`expiresIn`). Quando ele expirar, você deve usar o `refreshToken` para obter um novo `accessToken` sem a necessidade de reenviar as credenciais de login.

| Detalhe                 | Informação                      |
| :---------------------- | :------------------------------ |
| **Método**              | `POST`                          |
| **Endpoint**            | `/v1/oauth/token/refresh`       |
| **Corpo da Requisição** | JSON contendo o `refreshToken`. |

**Exemplo de Requisição (cURL):**

```bash
curl -X POST 'https://api.suaempresa.com/v1/oauth/token/refresh' \
-H 'Content-Type: application/json' \
-d '{
    "refreshToken": "SEU_REFRESH_TOKEN"
}'
```

A resposta será um novo objeto JSON contendo um novo `accessToken` e, opcionalmente, um novo `refreshToken`.

---
