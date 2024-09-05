# MovieList

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?logo=typescript) ![Next.js](https://img.shields.io/badge/Next.js-13.0.1-black?logo=next.js) ![.NET](https://img.shields.io/badge/.NET-5.0-blue?logo=dotnet) ![C#](https://img.shields.io/badge/C%23-11.0-purple?logo=csharp) ![TMDb API](https://img.shields.io/badge/TMDb-API-green?logo=themoviedatabase)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)

## Sumário

- [Introdução](#introdução)
- [Requisitos](#requisitos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração e Execução do Front-End](#configuração-e-execução-do-front-end)
- [Configuração e Execução do Back-End](#configuração-e-execução-do-back-end)
- [Exemplos de Uso](#exemplos-de-uso)
- [Informações Adicionais](#informações-adicionais)

## Introdução

O projeto **MovieList** visa criar uma aplicação web onde os usuários podem pesquisar filmes, visualizar detalhes de cada filme e gerenciar uma lista de favoritos. A aplicação consome a API do **The Movie Database (TMDb)** para fornecer informações detalhadas sobre os filmes. Além disso, é possível compartilhar sua lista de favoritos através de um link gerado automaticamente.

## Requisitos

### Front-End:

- **Node.js** versão 18.x ou superior
- **Yarn** ou **npm**
- **React** com **TypeScript**
- **Next.js**
- **Tailwind CSS** para estilização

### Back-End:

- **.NET 5.0**
- **C#**
- **PostgreSQL** como banco de dados

## Estrutura do Projeto

`/frontend -> Contém o código do front-end desenvolvido com Next.js e React`  
`/backend -> Contém o código do back-end com .NET 5.0`

### Front-End

- Integração com a API do TMDb
- Página para pesquisa de filmes
- Página de exibição de detalhes dos filmes
- Gerenciamento de lista de favoritos
- Compartilhamento da lista de favoritos com um link único
- Estilização utilizando Tailwind CSS

### Back-End

- API RESTful desenvolvida com .NET 5.0
- Endpoints para adicionar, listar e remover filmes dos favoritos
- Endpoint para gerar links de compartilhamento de listas de favoritos
- Banco de dados PostgreSQL para armazenar filmes e listas de compartilhamento

## Configuração e Execução do Front-End

1. Clone o repositório:

```bash
git clone https://github.com/gabrielcavalcant/MovieList.git
```

```bash
cd frontend
```

2.  Instale as dependências:

```bash
`npm install`
```

3.  Crie um arquivo `.env.local` na raiz do projeto e configure a chave da API do TMDb:

`NEXT_PUBLIC_TMDB_API_KEY=YOUR_TMDB_API_KEY`

4.  Inicie o servidor de desenvolvimento:

```bash
`npm run dev`
```

5.  Acesse o frontend em `http://localhost:3000`.

## Configuração e Execução do Back-End

1.  Na pasta `backend`, crie um arquivo `appsettings.json` com as seguintes configurações para conectar ao PostgreSQL:

```bash
`{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=mydb;Username=myuser;Password=mypassword"
  }
}`
```

2.  Compile o projeto .NET:

```bash
`dotnet build`
```

3.  Inicie o servidor:

```bash
`dotnet run`
```

4.  O backend estará disponível na porta `5001` por padrão.

## Exemplos de Uso

### Adicionar Filme aos Favoritos

- No front-end, após realizar uma busca por filmes, clique no ícone de coração para adicionar um filme à lista de favoritos.

### Compartilhar Lista de Favoritos

- Após adicionar filmes à sua lista de favoritos, clique no botão "Compartilhar Lista" e um link será gerado. Esse link pode ser copiado e compartilhado.

### Acessar Lista Compartilhada

- Qualquer pessoa com o link pode acessar a lista de filmes favoritos compartilhada.

## Informações Adicionais

- **API TMDb:** Integração para busca de filmes e detalhes.
- **Persistência:** A lista de favoritos é armazenada no banco de dados PostgreSQL.
- **Compartilhamento:** Geração de um link único para compartilhar listas de favoritos.
