# GitHub Repository Issue Tracker

Este projeto é uma aplicação que utiliza a API do GitHub para buscar repositórios com base no nome e exibir as issues classificadas como **Resolvidas** e **Não Resolvidas**.

## 🚀 Funcionalidades

- Buscar repositórios no GitHub a partir do nome.
- Exibir as issues do repositório em duas categorias:
  - **Resolvidas** (status: `closed`).
  - **Não Resolvidas** (status: `open`).
- Interface simples e intuitiva para interagir com os dados da API.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end**: React.
- **API**: GitHub REST API v3.
- **Persistência de Dados**:
  - Armazena no Firestore os repositórios buscados.
  - Mantém histórico de buscas e resultados.

