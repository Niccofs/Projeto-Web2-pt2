const express = require("express");
const modelLab = require("../models/Laboratorio");
const authMiddleware = require("../middlewares/auth");
const PDFDocument = require("pdfkit");
const axios = require("axios")
const { upload } = require("../config");
const router = express.Router();
//const { uploadToCloudinary } = require("../config/cloudinary")
const { uploadToS3, streamFromS3 } = require("../utils/s3");
const path = require("path");
let temperaturaAtual = null;

router.get("/api/laboratorio/relatorio", authMiddleware, async (_, res) => {
  try {
    const laboratorios = await modelLab.find();

    const doc = new PDFDocument();
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Relatório de Laboratórios", { align: "center" });
    doc.moveDown();

    for (const lab of laboratorios) {
      console.log(lab);

      doc.fontSize(12).text(`Id: ${lab.id}`);
      doc.fontSize(14).text(`Nome: ${lab.nome}`);
      doc.fontSize(12).text(`Descrição: ${lab.descricao}`);
      doc.text(`Capacidade: ${lab.capacidade}`);
      doc.text("Foto:");

      if (lab.foto) {
        try {
          const response = await axios.get(lab.foto, {
            responseType: "arraybuffer",
          });
          const buffer = Buffer.from(response.data, "binary");

          doc.image(buffer, { width: 200, height: 200, align: "center" });
        } catch (err) {
          console.error("Erro ao carregar imagem:", err.message);
          doc.fontSize(10).text("[Erro ao carregar imagem]");
        }
      }

      doc.moveDown();
      doc.text("-------------------------------");
      doc.moveDown();
    }

    doc.end();

    // Opcional: adicionar listener para quando a resposta acabar
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    console.log(`PDF gerado com sucesso em: ${filePath}`);
  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    if (!res.headersSent) {
      res.status(500).json({ erro: "Erro ao gerar relatório" });
    }
  }
});

// Rota para cadastrar um novo laboratório
// authMiddleware,
router.post(
  "/api/laboratorio/novo",
  authMiddleware,
  upload.single("foto"),
  async (req, res) => {
    try {
      const { nome, descricao, capacidade } = req.body;
      const foto = req.file;
      const capacidade_parsed = parseInt(capacidade, 10)

      if (!foto) {
        return res.status(400).json({ erro: "Falta foto" });
      }

          console.log("Arquivo recebido:", {
        originalname: foto.originalname,
        mimetype: foto.mimetype,
        size: foto.size,
      });

      console.log("tentando upar foto para o s3")
    
      //const result = await uploadToCloudinary(foto.buffer);
      const s3Url = await uploadToS3(foto.buffer, foto.mimetype, foto.originalname);
      console.log(`url: ${s3Url}`)

      if (!nome || !descricao || isNaN(capacidade)) {
        return res
          .status(400)
          .json({ erro: "Nome, descrição e capacidade são obrigatórios" });
      }

      const novoLab = await modelLab.create({
        nome,
        descricao,
        capacidade: capacidade_parsed,
        foto: s3Url || null,
      });
      res.status(201).json({
        mensagem: "Laboratório cadastrado com foto",
        laboratorio: novoLab,
      });
    } catch (err) {
      console.error(err)
      res.status(500).json({
        erro: "Erro ao salvar no banco de dados",
        detalhes: err.message,
      });
    }
  }
);

router.delete("/api/laboratorio/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletado = await modelLab.findByIdAndDelete(id);

    if (!deletado) {
      return res.status(404).json({ erro: "Laboratório não encontrado" });
    }

    res.json({ mensagem: "Laboratório deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir laboratório:", err);
    res.status(500).json({ erro: "Erro ao excluir laboratório" });
  }
});

router.get("/api/videoTutorial", authMiddleware, async (req, res) => {
  const range = req.headers.range || 'bytes=0-';
  const key = "tutorial/0625.mp4";

  if (!range) {
    return res.status(416).send("Range header é necessário para streaming.");
  }

  try {
    const { stream, fileSize, start, end } = await streamFromS3(key, range);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    stream.pipe(res);
    stream.on("error", (err) => {
      console.error("Erro ao fazer streaming do S3:", err);
      res.status(500).end();
    });
  } catch (err) {
    console.error("Erro ao recuperar vídeo:", err);
    res.status(500).json({ erro: "Erro ao recuperar vídeo" });
  }
});


router.get("/api/bloquear", (req, res) => {

    const filePath = path.join(__dirname, "..", "public", "index.html");
    res.sendFile(filePath);
});

router.post("/api/bloquear/:lab", authMiddleware, async (req, res) => {
  const lab = req.params.lab;
  console.log(`lab: ${lab}`);

  try {
    const laboratorio = await modelLab.findByIdAndUpdate(
      { _id: lab },
      { $set: { blocked: true } }
    );

    if (!laboratorio) {
      return res.status(404).json({ erro: 'Laboratório não encontrado.' });
    }

    const message = `Laboratório ${lab} foi bloqueado.`;
    //sseClients.forEach(client => client.write(`data: ${JSON.stringify({ mensagem: message })}\n\n`));

    res.status(200).json({ mensagem: message });
  } catch (erro) {
    throw new Error(`Erro interno: ${erro}`);
  }
});

router.get("/api/temperatura", (req, res) => {
  const { temp } = req.query;

  if (!temp) {
    return res.status(400).send("Temperatura não informada.");
  }

  temperaturaAtual = temp;
  console.log(`Temperatura recebida do Wokwi: ${temp}°C`);
  res.send("Temperatura registrada com sucesso.");
});

router.get("/api/temperaturaAtual", (req, res) => {
  if (!temperaturaAtual) {
    return res.status(404).send("Nenhuma temperatura registrada ainda.");
  }

  res.json({ temperatura: temperaturaAtual });
});

module.exports = router;
