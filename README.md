# Frontend - Barber 

Este repositório contém o frontend de uma aplicação para agendamento de barbearia.

## Estrutura

 - Interface web construída com React


## Dependencias do projeto

É necessario a execução do comando para inicizalizar o projeto

```sh
npm i
```

## Variaveis de Ambiente 

```sh
cat > ./.env <<EOL

# Auth fixo do backend
NEXT_PUBLIC_API_AUTH_SECRET=grandeSegredo

# Link da api 
NEXT_PUBLIC_API_URL=grandeSegredo

EOL
```

## Iniciar servidor de desenvolvimento

```sh
npm run dev
```