const request = require("supertest");
const app = require("../api/index");
const Laboratorio = require("../models/Laboratorio");
const mongoose = require("mongoose");
const { MONGODB_URL } = require("../config");
const path = require('path');

let authToken;

beforeAll(async () => {
  await mongoose.connect(MONGODB_URL);

  // Criar um usuário e obter token para os testes
  await request(app).post("/api/cadastrar").send({
    nome: "Admin Teste",
    email: "admin@teste.com",
    senha: "123456",
  });

  const tokenRes = await request(app).post("/api/logar").send({
    email: "admin@teste.com",
    senha: "123456",
  });

  authToken = tokenRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Laboratorio.deleteMany({});
});

describe("Testes de Laboratório", () => {
  it("deve cadastrar um novo laboratório", async () => {
    const res = await request(app)
      .post("/api/laboratorio/novo")
      .set("Authorization", `Bearer ${authToken}`)
      .set("Content-Type", "multipart/form-data")
      .field("nome", "Lab Teste")
      .field("descricao", "Laboratório de Testes")
      .field("capacidade", 30)
      .attach("foto", path.resolve(__dirname, "uploads", "teste.jpg"));

    //console.log(res);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(
      "mensagem",
      "Laboratório cadastrado com foto"
    );
    expect(res.body.laboratorio).toHaveProperty("nome", "Lab Teste");
  });

  it("deve deletar um laboratório existente", async () => {
    // Primeiro cria um laboratório
    const lab = await Laboratorio.create({
      nome: "Lab para Deletar",
      descricao: "Será deletado",
      capacidade: 20,
      foto: "url-teste",
    });

    const res = await request(app)
      .delete(`/api/laboratorio/${lab._id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "mensagem",
      "Laboratório deletado com sucesso"
    );
  });

  it("deve gerar relatório PDF", async () => {
    const res = await request(app)
      .get("/api/laboratorio/relatorio")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("application/pdf");
  });
});
