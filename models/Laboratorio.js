const mongoose = require('mongoose');

const laboratorioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  capacidade: { type: Number, required: true },
  blocked: { type: Boolean, default: false },
  foto: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Laboratorio', laboratorioSchema);
