const express = require("express");
const restrictAccessMiddleware = require("../middlewares/restrictAccess");
const serverless = require("serverless-http");
const { PORT, appConfig } = require("../config");
const connectDB = require("../config/database");
const labRouter = require("../routers/laboratorioController");
const authRouter = require("../routers/authController");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(appConfig);
app.use(restrictAccessMiddleware);
app.use(labRouter);
app.use(authRouter);
// Disponibiliza io para os routers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rota POST /bloquear/:lab
app.use(labRouter);

// Home
app.get("/api", (_, res) => {
  res.send("🚀 Bem-vindo à API de Gerenciamento de Salas!");
});

// Rota de login
// Apenas para tests locais
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

// vercel

module.exports = app;
module.exports.handler = serverless(app);
