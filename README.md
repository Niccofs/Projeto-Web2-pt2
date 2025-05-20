# Atividade N1B Web 2 - API sistema de gerenciamento de salas

## 👥 Equipe
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/106767229?s=400&u=d91f527c50979c457174cc70127a0411747c70e5&v=4" width=115><br><sub>Nicolas Ferreira</sub>](https://github.com/Niccofs) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/100231973?v=4" width=115><br><sub>Rudhá Esmeraldo</sub>](https://github.com/rudhaesmeraldo) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/90151294?v=4" width=115><br><sub>Hívina Yanna</sub>](https://github.com/hivinayanna) |
| :---: | :---: | :---: |

## Estrutura de Pastas do Código

A estrutura de pastas é organizada para refletir a separação de responsabilidades e facilitar a manutenção do código:

```
src/
  ├── api/
      ├── app.js
      ├── index.js
  ├── models/
      ├── Laboratorio.js
      └── user.js
  ├── routers/
      ├── authController.js
      └── laboratorioController.js    
  ├── middlewares/
      ├── authMiddleware.js
      └── restrictAccessMiddleware.js
  ├── utils
      └── generate-keys.js
  ├── index.js
  ├── package.json
```

## 🔨 Funcionalidades do Projeto

- Rota /login para geração de token
- Rota /laboratorio/novo para cadastro de novo laboratório
- Middleware para acesso a API apenas de segunda a sexta
- Rota /laboratorio/relatorio para geração de arquivo PDF para download, listando todos os laboratórios com fotos
- Armazenamento em nuvem da API no Vercel

### 🛠 Tecnologias

- **React Native**
- **Node.js**
- **MongoDB**
- **JavaScript**
- **Vercel**