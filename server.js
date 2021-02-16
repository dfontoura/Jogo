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
const howManyFruits = 3
const footerScore = [1, 2] //document.getElementById('score');

const game = createGame({screenWidth: 15, screenHeight: 15, startSpeed: speed})

game.subscribe((command) => {
    sockets.emit(command.type, command)
})

var TimerMovePlayer = setInterval(game.movePlayers, game.state.speed);


//game.addPlayer({playerID: playerName, playerColor: playerColor, playerPieces:[{x: 3, y:1}], playerDirection: ['ArrowRight']})

for (let i = 1; i <= howManyFruits; i++) {
    game.addFruit()

}


sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`Player connected on Server with id: ${playerId}`)

    game.addPlayer({playerId: playerId})

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({playerId: playerId})
        console.log(`> Player disconnected: ${playerId}`)
    })

    socket.on('change-direction', (command) => {
        command.playerId = playerId
        command.type = 'change-direction'

        game.changeDirection(command);
    })

})


server.listen(3000, () => {
    console.log('> Server listenin on port: 3000');
})