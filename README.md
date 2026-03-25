# 📦 Kore Manager

> Sistema completo de e-commerce e gestão comercial, projetado para otimizar o controle de estoque, vendas e administração de negócios.

## 💻 Sobre o Projeto

O **Kore Manager** é uma aplicação Full-Stack desenvolvida para oferecer uma solução de ponta a ponta na gestão de lojas e comércios. Ele une uma interface amigável para o usuário final com um painel administrativo poderoso (Dashboard) para o controle da operação. 

Este projeto foi arquitetado com foco em escalabilidade, boas práticas de código e performance, servindo como uma solução comercial real e um demonstrativo de arquitetura de software.

## 🚀 Tecnologias Utilizadas

**Back-end & Infraestrutura:**
* **[Node.js](https://nodejs.org/)** - Ambiente de execução
* **[Express](https://expressjs.com/)** - Framework web para a API
* **[Drizzle ORM](https://orm.drizzle.team/)** - Mapeamento objeto-relacional (Type-safe e rápido)
* **[AWS](https://aws.amazon.com/)** - Hospedagem e Banco de Dados

**Front-end:**
* **HTML5 / CSS3** - Estruturação e estilização
* **JavaScript (Vanilla)** - Interatividade e consumo da API

## ⚙️ Funcionalidades

- [x] **Gestão de Produtos:** Cadastro, edição, exclusão e listagem de itens.
- [x] **Dashboard Administrativo:** Painel central para visão geral do negócio.
- [ ] **Carrinho de Compras:** Fluxo completo de seleção e checkout.
- [ ] **Controle de Estoque:** Baixa automática de itens após a venda.
- [ ] **Gestão de Clientes:** Histórico de compras e dados cadastrais.

## 🛠️ Como rodar o projeto localmente

### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
* [Git](https://git-scm.com)
* [Node.js](https://nodejs.org/en/)

### 🎲 Rodando a Aplicação

```bash
# Clone este repositório
$ git clone https://github.com/SampaioFelipe-Dev/sistema-gestao-api.git

# Acesse a pasta do projeto no terminal
$ cd kore-manager

# Instale as dependências
$ npm install

# Crie um arquivo .env na raiz do projeto e configure suas variáveis baseadas no .env.example
# Exemplo do que preencher no .env:
# DATABASE_URL=mysql://user:password@host-aws:3306/kore_db
# PORT=3000

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

## 🗂️ Estrutura do Projeto
```text
kore-manager/
├── src/
│   ├── controllers/    # Lógica de controle das rotas
│   ├── models/         # Schemas do Drizzle ORM
│   ├── routes/         # Definição dos endpoints da API
│   ├── views/          # Páginas HTML/CSS/JS do frontend
│   └── server.js       # Ponto de entrada da aplicação
├── .env.example        # Exemplo das variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
└── package.json        # Dependências e scripts do projeto

📬 Contato
Felipe

E-mail: dev.felipesampaio@gmail.com

LinkedIn: https://www.linkedin.com/in/felipe-sampaio-37b368233/
 

GitHub: https://github.com/SampaioFelipe-Dev
