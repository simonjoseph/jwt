# JWT Authentication API

Este projeto é uma API simples de autenticação utilizando JWT (JSON Web Token) com Node.js e Express.

## Funcionalidades
- **Login**: Gera um token de acesso (JWT) e um refresh token para o usuário.
- **Refresh Token**: Permite renovar o token de acesso utilizando o refresh token.
- **Logout**: Invalida o token de acesso e o refresh token do usuário.
- **Rota protegida**: Exemplo de rota que exige autenticação via JWT.

## Rotas

### POST `/login`
- **Descrição**: Realiza o login do usuário e retorna um token de acesso e um refresh token.
- **Body**:
  ```json
  {
    "username": "admin",
    "password": "password"
  }
  ```
- **Resposta**:
  ```json
  {
    "acessToken": "<jwt>",
    "refreshToken": "<refresh_token>"
  }
  ```

### POST `/refresh`
- **Descrição**: Gera um novo token de acesso e refresh token a partir de um refresh token válido.
- **Headers**:
  - `Authorization: Bearer <refresh_token>`
- **Resposta**:
  ```json
  {
    "acessToken": "<novo_jwt>",
    "refreshToken": "<novo_refresh_token>"
  }
  ```

### POST `/logout`
- **Descrição**: Invalida o token de acesso e o refresh token do usuário.
- **Headers**:
  - `Authorization: Bearer <jwt>`
- **Resposta**:
  ```json
  {
    "token": null
  }
  ```

### GET `/clientes`
- **Descrição**: Rota protegida, retorna dados de exemplo. Necessário enviar o token JWT no header.
- **Headers**:
  - `Authorization: Bearer <jwt>`
- **Resposta**:
  ```json
  {
    "id": 1,
    "nome": "Simão jose"
  }
  ```

## Como rodar o projeto
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env` com as seguintes variáveis:
   ```env
   JWT_SECRET=sua_chave_secreta
   JWT_EXPIRES=3600
   REFRESH_EXPIRES=600000
   PORT=3000
   ```
3. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Dependências principais
- express
- jsonwebtoken
- dotenv-safe
- uuid

---

> Projeto desenvolvido para fins de estudo sobre autenticação JWT com Node.js.
