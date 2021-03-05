import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import * as io from 'socket.io'
import { Socket } from 'dgram'

const app = express()
const server = http.createServer(app)
const sockets = new io.Server(server)

app.use(express.static('public'))

const speed = 200
const initialFruits = 3
const footerScore = [1, 2] //document.getElementById('score');

const game = createGame({screenWidth: 20, screenHeight: 20, maxFruits: initialFruits})

game.subscribe((command) => {
    sockets.emit(command.type, command)
})

var TimerMovePlayer = setInterval(game.movePlayers, speed);


//game.addPlayer({playerID: playerName, playerColor: playerColor, playerPieces:[{x: 3, y:1}], playerDirection: ['ArrowRight']})

for (let i = 1; i <= initialFruits; i++) {
    game.addFruit()

}


sockets.on('connection', (socket) => {
    const playerId = socket.id
    //console.log(socket);
    //const playerName = socket.handshake.query
    //console.log(socket.handshake.query);
    //console.log(`Player connected on Server with id: ${playerId} and name: ${playerName}`)
 
    game.addPlayer({playerId: playerId})

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({playerId: playerId})
        console.log(`> Player disconnected: ${playerId}`)
    })

    socket.on('add-player-name', (playerName) => {
        game.addPlayerName({playerId: playerId, playerName: playerName})
        console.log(`> Player ${playerId} now have a name: ${playerName}`)
    })

    socket.on('change-direction', (command) => {
        command.playerId = playerId
        command.type = 'change-direction'

        game.changeDirection(command);
    })

})


server.listen(80, () => {
    console.log('> Server listening on port: 80');
})