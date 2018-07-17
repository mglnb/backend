<img src="https://api.travis-ci.org/mglnb/backend.svg?branch=master" alt="TravisCI" />

# Backend api

Utilizando [AdonisJS](https://adonisjs.com/) para criação da api backend, já tem algumas coisas configuradas como:

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

### Requisitos:
 - Adonis Cli ( `npm i -g @adonisjs/cli` )
 - Node.js >= 8.0 (Usamos: 10.6.0)
 - Npm >= 3.0 (Usamos: 6.1.0)
 - Postgres 10

### Instruções

 - Clone o repositório e rode `npm install` para instalar as dependências.
 - Crie uma cópia do .env.example e renomeie para .env.
 - Configure as informações do banco de dados no .env.
 - Rode `adonis key:generate` para configurar o APP_KEY ( usado para deixar os [cookies seguros](https://adonisjs.com/docs/4.1/security-introduction#_session_security) e usado como secret das senhas deixando o hash mais seguro. ).
 - Crie no postgres o banco configurado no .env na chave `DB_DATABASE` (default: `birrepi`).
 - Rode `adonis migration:run`, deverá aparecer uma mensagem como: `Database migrated successfully in x ms`.
 - Rode `adonis serve --dev` para iniciar aplicação. 
 - Pronto já pode codar :).
