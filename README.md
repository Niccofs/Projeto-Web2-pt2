# Atividade N1B Web 2 - API sistema de gerenciamento de salas

---

## 👥 Equipe
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/106767229?s=400&u=d91f527c50979c457174cc70127a0411747c70e5&v=4" width=115><br><sub>Nicolas Ferreira</sub>](https://github.com/Niccofs) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/100231973?v=4" width=115><br><sub>Rudhá Esmeraldo</sub>](https://github.com/rudhaesmeraldo) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/90151294?v=4" width=115><br><sub>Hívina Yanna</sub>](https://github.com/hivinayanna) |
| :---: | :---: | :---: |

---

## Estrutura de Pastas do Código

A estrutura de pastas é organizada para refletir a separação de responsabilidades e facilitar a manutenção do código:

```
src/
  ├── api/
      ├── index.js
  ├── config/
      ├── cloudinary.js
      ├── database.js
      └── index.js
  ├── models/
      ├── Laboratorio.js
      └── user.js
  ├── routers/
      ├── authController.js
      └── laboratorioController.js    
  ├── middlewares/
      ├── auth.js
      └── restrictAccess.js
  ├── utils
      └── generate-keys.js
  ├── tests
      ├── /uploads
      ├── auth.test.js
      ├── laboratorio.test.js    
  ├── package.json
  ├── compose.yaml
```
---

## 🛠 Tecnologias

- **Node.js**
- **MongoDB**
- **JavaScript**
- **Vercel**
- **Cloudinary**
- **Jest**
- **Docker**
---
## Rota GET /api
Retorna "🚀 Bem-vindo à API de Gerenciamento de Salas!", servindo como teste primário de funcionamento da API.

---

## Rota POST /api/cadastrar

Cadastra um usuário no mongodb recebendo nome, email e senha

### Exemplo de Entrada

```
{
    "nome": "Hivina",
    "email": "admin@teste.com",
    "senha": "123456"
}
```

### Saída

```
{
    "mensagem": "Usuário cadastrado com sucesso"
}
```
---

## Rota POST /logar

Loga um usuário já cadastrado anteriormente para gera um token via jwt

### Exemplo de Entrada
```
{
  "email": "admin@teste.com",
  "senha": "123456"
}
```

### Saída

```
{
    "token": "<token_jwt>"
}
```
---

## Rota POST /laboratorio/novo

Recebe as informações para cadastrar um laboratório novo com foto. 

### Exemplo de Entrada

(formData)
```
{
  "nome": "laboratorio teste",
  "descricao": "apenas um teste",
  "capacidade": 4,
  "foto": <tipo_file>
}
```

### Saída

```
{
    "mensagem": "Laboratório cadastrado com foto",
    "laboratorio": {
        "nome": "lab normal 2",
        "descricao": "um dos laboratórios",
        "capacidade": 40,
        "foto": "https://res.cloudinary.com/<cloud_name>/image/upload/v1747794004/id.jpg",
        "_id": "682d38530d189d5da36016fc",
        "createdAt": "2025-05-21T02:20:03.527Z",
        "updatedAt": "2025-05-21T02:20:03.527Z",
        "__v": 0
    }
}
```
---

## Rota GET /laboratorio/relatorio

Gera um relatório em PDF listando todos os laboratórios cadastrados via MongoDB 

### Saída (PDF)

![alt text](image-1.png)

---

## Rota DELETE /laboratorio/:id

Deleta um laboratório ao fornecer o seu id como parâmetro

### Exemplo de Requisição
```
DELETE http://localhost:3000/laboratorio/12345
```

### Saída

```
{
    "mensagem": "Laboratório deletado com sucesso"
}
```
---



