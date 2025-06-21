let io;

module.exports = {
  init: (server) => {
      io = require('socket.io')(server, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      });
    
    io.on('connection', (socket) => {
      console.log(`Cliente conectado em ${socket.id}`);
    });

  },
  getIO: () => {
    if (!io) {
      throw new Error('Erro ao inicializar socket.');
    }
    return io;
  }
};
