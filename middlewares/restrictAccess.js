function restrictAccessMiddleware(req, res, next) {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda-feira, ..., 6 = sábado

  if (diaSemana === 0 || diaSemana === 6) {
    return res.status(403).json({ erro: 'Acesso à APi permitido apenas de segunda a sexta-feira' });
  }

  next();
}

module.exports = restrictAccessMiddleware;
