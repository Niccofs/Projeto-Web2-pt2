const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const User = require("../models/user");

router.post("/api/logar", async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await User.findOne({ email });

  if (!usuario) return res.status(401).json({ erro: "Usuário não encontrado" });

  const senhaValida = await bcrypt.compare(senha, usuario.password);
  if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta" });

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

router.post("/api/cadastrar", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    console.log("Dados recebidos: ", req.body);
    if (!senha) {
      return res.status(400).json({ erro: "Campo 'senha' é obrigatório." });
    }
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente)
      return res.status(400).json({ erro: "Usuário já cadastrado" });

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = new User({ name: nome, email, password: senhaHash });

    await novoUsuario.save();
    console.log("deu certo");

    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

module.exports = router;
