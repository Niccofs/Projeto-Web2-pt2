const jwt = require("jsonwebtoken");
const SECRET = require("../config").SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ erro: "Token não fornecido na requisição." });

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token)
    return res.status(401).json({ erro: "Token inválido" });

  try {
    const payload = jwt.verify(token, SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    res.status(401).json({ erro: `Token ${token} expirado ou inválido` });
  }
}

module.exports = authMiddleware;
