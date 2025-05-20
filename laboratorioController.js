const fs = require('fs');
const path = require('path');

let laboratorios = []; // Simulando um "banco de dados" de laboratórios

function cadastrarLaboratorio(req, res) {
  const { nome, descricao, capacidade } = req.body;
  const foto = req.file;

  if (!nome || !descricao || !capacidade || !foto) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios (nome, descrição, capacidade, foto)' });
  }

  // Simula o caminho onde a imagem ficará armazenada (no diretório 'uploads')
  const caminhoFoto = path.join(__dirname, 'uploads', foto.filename);

  const novoLaboratorio = {
    id: laboratorios.length + 1,
    nome,
    descricao,
    capacidade,
    foto: caminhoFoto,
  };

  laboratorios.push(novoLaboratorio);

  res.status(201).json({
    mensagem: 'Laboratório cadastrado com sucesso!',
    laboratorio: novoLaboratorio,
  });
}

module.exports = { cadastrarLaboratorio };
