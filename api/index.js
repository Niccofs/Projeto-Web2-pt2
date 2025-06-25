const express = require("express");
const restrictAccessMiddleware = require("../middlewares/restrictAccess");
const serverless = require("serverless-http");
const connectDB = require("../config/database");
const path = require("path");
const app = express();

app.use(express.json());

const { PORT, appConfig } = require("../config");
const labRouter = require("../routers/laboratorioController");
const authRouter = require("../routers/authController");
const http = require("http");
const socketIO = require('./socket'); 
const server = http.createServer(app);


socketIO.init(server);

// Garantir conversão buffer bas64 (api gateway) para JSON
app.use(async (req, res, next) => {
  try {
    if (req.body && Buffer.isBuffer(req.body)) {
      // Se for Buffer, converte para string e depois para JSON
      const text = req.body.toString('utf8');
      req.body = JSON.parse(text);
    }
  } catch (err) {
    throw new Error(err)
  }
  next();
});

app.use(appConfig);
app.use(restrictAccessMiddleware);
app.use(async (req, res, next) => {
  const ignorePaths = ['/favicon.ico', '/favicon.png'];
  if (ignorePaths.includes(req.path)) return res.status(204).end();

  try {
    console.log("Conectando ao MongoDB...");
    await connectDB();
    console.log("MongoDB conectado com sucesso.");
    next();
  } catch (err) {
    console.error("Erro ao conectar:", err);
    res.status(500).json({ error: "Erro ao conectar ao banco de dados." });
  }
});
app.use(labRouter);
app.use(authRouter);

app.use(express.static(path.join(__dirname, "..", "public")));


// Home
app.get("/api", (_, res) => {
  res.send("🚀 Bem-vindo à API de Gerenciamento de Salas!");
});

app.post("/api/teste", (req, res) => {
  console.log("req.body:", req.body);
  res.json({ recebido: req.body });
});

// Apenas para tests locais
if (process.env.NODE_ENV !== 'test') {

  server.listen(PORT, async () => {
    await connectDB();
    console.log(`Servidor rodando na porta ${PORT}`);
  });

} 

// vercel
module.exports = app;
module.exports.handler = serverless(app);
