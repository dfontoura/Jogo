export default function createGame({ screenWidth, screenHeight, maxFruits }) {

    const state = {
        players: {},
        fruits: {},
        screen: { width: screenWidth, height: screenHeight },
        highScore: {playerName: "", score: 0}
    }

    const fruitColor = 'Crimson'

    const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

    const observers = []  

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command){
        for (const observerfunction of observers){
            observerfunction(command);
        }
    }



    function setState(newState) {
        Object.assign(state, newState)
    }


    function addPlayer(command) {
        const playerId = command.playerId
        const playerName = 'playerName' in command ? command.playerName : playerId.substring(0 , 10)
        const playerColor = 'playerColor' in command ? command.playerColor : 'green'

        const playerPieces = 'playerPieces' in command ? command.playerPieces : [randomPosition()]
        const playerDirection = 'playerDirection' in command ? command.playerDirection : directions[Math.floor(Math.random() * 4.9)] 


        state.players[playerId] = {
            name: playerName,
            color: playerColor,
            length: Object.keys(playerPieces).length,
            pieces: playerPieces,
            direction: [playerDirection],
            changeDirectionRequest: false,
            score: 0
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerPieces: playerPieces,
        })
    }

    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    function addPlayerName({playerId, playerName}) {    
        state.players[playerId].name = playerName
    }


    function addFruit(fruitPosition) {
        let fruitsLength = Object.keys(state.fruits).length
        const newFruitId = 'fruit' + Math.floor(Math.random() * 9999)
        const newFruitColor = fruitColor
        const newFruitPosition = fruitPosition ? fruitPosition : randomPosition () 
        
        state.fruits[newFruitId] = {
            color: newFruitColor,
            length: fruitsLength,
            x: newFruitPosition.x,
            y: newFruitPosition.y
        }

    }

    function removeFruit(command) {
        const fruitId = command.fruitId
        delete state.fruits[fruitId]
    }

    function checkForFruitCollision(playerId) {
        const player = state.players[playerId]
        const theHead = player.pieces[0]
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            if (theHead.x === fruit.x && theHead.y === fruit.y) {
                removeFruit({ fruitId: fruitId })
                player.length += 1
                player.score += 50

                const howManyFruits = Object.keys(state.fruits).length
                if (howManyFruits < maxFruits) {
                    addFruit()    
                }
                
                if ( player.score > state.highScore.score ){
                    state.highScore.playerName = player.name
                    state.highScore.score = player.score
                }

                notifyAll({
                    type: 'eat-fruit',
                    playerId: playerId
                })

            }
        }
    }

    function randomPosition() {
        let newX = Math.floor(Math.random() * (state.screen.width))
        let newY = Math.floor(Math.random() * (state.screen.height))

        TestIfAnyCollision: {
            for (const eachPlayerID in state.players) {
                const eachPlayer = state.players[eachPlayerID]
                for (const eachPiece of eachPlayer.pieces) {
                    if (newX === eachPiece.x && newY === eachPiece.y) {
                        let newPosition = randomPosition()
                        newX = newPosition.x
                        newY = newPosition.y
                        break TestIfAnyCollision
                    }
                }
            }
        }

        const x = newX
        const y = newY

        return {
            x,
            y,
        }
    }


    function checkForCollision(playerId) {
        const thePlayerId = playerId
        const thePlayer = state.players[playerId]
        const theHead = thePlayer.pieces[0]
        const thePieces = thePlayer.pieces

        search: {
            for (const aPlayerId in state.players) {
                const aPlayer = state.players[aPlayerId]
                const aPlayerPiece = aPlayer.pieces
                for (let i = 0; i < aPlayerPiece.length; i++) {
                    if ( thePlayerId === aPlayerId && i === 0) { 
                        continue
                    } 

                    if (theHead.x === aPlayerPiece[i].x && theHead.y === aPlayerPiece[i].y) { //Colisão!
                        if (thePlayerId !== aPlayerId) { //o adversário ganha as peças
                            aPlayer.pieces = aPlayer.pieces.concat(thePieces)
                            aPlayer.score += thePlayer.score
                            if ( aPlayer.score > state.highScore.score ){
                                state.highScore.playerName = aPlayer.name
                                state.highScore.score = aPlayer.score
                            }
             
                        }  
                        //else{
                        //    for (let i = 1; i < thePieces.length; i++) {
                        //        const newFruitPosition = thePieces[i]
                        //        addFruit(newFruitPosition)
                        //    }
                        //} 


                        state.players[thePlayerId].pieces.length = 1
                        state.players[thePlayerId].length = 1
 
                        state.players[thePlayerId].score = 0

                        notifyAll({
                            type: 'collision',
                            playerId: playerId
                        })
                        break search

                    }
                }
            }
        }
    }




    function changeDirection(command) {

        const aceptedKeys = {
            ArrowUp(player) {
                let lenDirections = player.direction.length
                if (player.direction[lenDirections - 1] !== 'ArrowDown' && player.direction[lenDirections - 1] !== 'ArrowUp') {
                    if (lenDirections > 1 || player.changeDirectionRequest === true) {
                        player.direction.push('ArrowUp')
                    }
                    else {
                        player.direction[0] = 'ArrowUp'
                        player.changeDirectionRequest = true
                    }
                }
            },
            ArrowDown(player) {
                let lenDirections = player.direction.length
                if (player.direction[lenDirections - 1] !== 'ArrowUp' && player.direction[lenDirections - 1] !== 'ArrowDown') {
                    if (lenDirections > 1 || player.changeDirectionRequest === true) {
                        player.direction.push('ArrowDown')
                    }
                    else {
                        player.direction[0] = 'ArrowDown'
                        player.changeDirectionRequest = true
                    }
                }
            },
            ArrowLeft(player) {
                let lenDirections = player.direction.length
                if (player.direction[lenDirections - 1] !== 'ArrowRight' && player.direction[lenDirections - 1] !== 'ArrowLeft') {
                    if (lenDirections > 1 || player.changeDirectionRequest === true) {
                        player.direction.push('ArrowLeft')
                    }
                    else {
                        player.direction[0] = 'ArrowLeft'
                        player.changeDirectionRequest = true
                    }
                }
            },
            ArrowRight(player) {
                let lenDirections = player.direction.length
                if (player.direction[lenDirections - 1] !== 'ArrowLeft' && player.direction[lenDirections - 1] !== 'ArrowRight') {
                    if (lenDirections > 1 || player.changeDirectionRequest === true) {
                        player.direction.push('ArrowRight')
                    }
                    else {
                        player.direction[0] = 'ArrowRight'
                        player.changeDirectionRequest = true
                    }

                }
            
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[playerId]

        const changeDirectionFunction = aceptedKeys[keyPressed]
        if (player && changeDirectionFunction) {
            changeDirectionFunction(player)
        }


        return

    }


    function movePlayers() {


        for (const playerId in state.players) {

            const player = state.players[playerId]
            player.changeDirectionRequest = false
            const theHead = player.pieces[0]
            const playerLength = player.length
            const playerPieces = player.pieces
            const playerDirection = player.direction

            const aceptedDirections = {
                ArrowUp(player) {
                    if (theHead.y > 0) {
                        playerPieces.unshift({ x: theHead.x, y: theHead.y - 1 })
                    }
                    else {
                        playerPieces.unshift({ x: theHead.x, y: state.screen.height - 1 })
                    }

                    if (playerLength < playerPieces.length) {
                        player.pieces.pop()
                    }
                },

                ArrowDown(player) {
                    if (theHead.y < state.screen.height - 1) {
                        playerPieces.unshift({ x: theHead.x, y: theHead.y + 1 })
                    }
                    else {
                        playerPieces.unshift({ x: theHead.x, y: 0 })
                    }
                    if (playerLength < playerPieces.length) {
                        player.pieces.pop()
                    }
                },

                ArrowLeft(player) {
                    if (theHead.x > 0) {
                        playerPieces.unshift({ x: theHead.x - 1, y: theHead.y })
                    }
                    else {
                        playerPieces.unshift({ x: state.screen.width - 1, y: theHead.y })
                    }
                    if (playerLength < playerPieces.length) {
                        player.pieces.pop()
                    }
                },

                ArrowRight(player) {
                    if (theHead.x < state.screen.width - 1) {
                        playerPieces.unshift({ x: theHead.x + 1, y: theHead.y })

                    }
                    else {
                        playerPieces.unshift({ x: 0, y: theHead.y })
                    }
                    if (playerLength < playerPieces.length) {
                        player.pieces.pop()
                    }
                }
            }


            const movePlayerFunction = aceptedDirections[playerDirection[0]]
            if (movePlayerFunction) {
                movePlayerFunction(player)
                if (playerDirection.length > 1) {
                    playerDirection.shift()
                }
            }

            checkForFruitCollision(playerId)
            checkForCollision(playerId)

        }

        const command = {
            type: 'move-players',
            state: state
        }
        notifyAll(command)

    }

    return {
        setState,
        addPlayerName,
        changeDirection,
        movePlayers,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        state,
        subscribe
    }


}
