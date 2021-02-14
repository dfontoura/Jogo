import express from 'express'
import http from 'http'
import createGame from './public/game.js'

const app = express()
const server = http.createServer(app)

app.use(express.static('public'))

let fruitColor = 'Crimson'
let playerColor = 'LawnGreen'
let playerName = 'player1'
const speed = 300
const footerScore = [1, 2] //document.getElementById('score');

const game = createGame({screenWidth: 15, screenHeight: 15, scorePanel: footerScore, startSpeed: speed})

game.addPlayer({playerID: playerName, playerColor: playerColor, playerPieces:[{x: 3, y:1}], playerDirection: ['ArrowRight']})

game.addFruit({fruitID: 'fruit1', fruitColor: fruitColor, fruitX: 3, fruitY:5})

console.log(game.state);

server.listen(3000, () => {
    console.log('> Server listenin on port: 3000');
})