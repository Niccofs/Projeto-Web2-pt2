const express = require("express");
let io;

module.exports = (io) => {
    const router = express.Router();

    router.post("/api/bloquear/:lab", (req, res) => {
        const lab = req.params.lab;
        const canal = `bloquear(${lab})`;

        io.emit(canal, {
            mensagem: `Laboratório ${lab} foi bloqueado.`,
        });

        res.json({ status: "ok", canal });
    });

    return router;
};
