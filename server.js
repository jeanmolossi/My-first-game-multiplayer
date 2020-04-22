console.log("> Script started");
import express from 'express';
import http from 'http';
import createGame from './src/game';
import socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use( express.static(__dirname + '/src') );

const game = createGame();
game.start();

game.subscribe((command) => {
  console.log(`> Emitting ${command.type}`)
  io.emit(command.type, command)
})

console.log(game.state)

io.on( 'connection', socket => {
  const playerId = socket.id
  console.log(`> Player connected on Server with id: ${playerId}`);
  
  game.addPlayer({ playerId });

  socket.emit('setup', game.state)

  socket.on('disconnect', () => {
    game.removePlayer({ playerId })
    console.log(`> Player ${playerId} disconnected`)
  })

  socket.on('@game/movePlayer', command => {
    command.playerId = playerId
    command.type = '@game/movePlayer'

    game.movePlayer(command)
    console.log(`> Player ${playerId} -> ${command.type}`)
  })

});



server.listen(3000, () =>
  console.log('> Server running on -p 3000')
);