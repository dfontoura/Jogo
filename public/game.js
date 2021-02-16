export default function createGame({ screenWidth, screenHeight, startSpeed }) {

    const state = {
        players: {},
        fruits: {},
        screen: { width: screenWidth, height: screenHeight },
        pause: false,
        changeDirectionRequest: false,
        speed: startSpeed,
        gameOver: false,
        fruitColor: 'Crimson'
    }

    

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
        const playerColor = 'playerColor' in command ? command.playerColor : 'green'

        //const playerInitialPosition = [randomPosition()]
         //const arrayOfPositions = [{randomposition}]      //x: randomPosition.x, y: randomPosition.y}]
        const playerPieces = 'playerPieces' in command ? command.playerPieces : [randomPosition()]
        const teste = Math.floor(Math.random() * 4.9)
        const playerDirection = 'playerDirection' in command ? command.playerDirection : directions[teste] //Math.floor(Math.random() * 4.9)]


        state.players[playerId] = {
            color: playerColor,
            length: Object.keys(playerPieces).length,
            pieces: playerPieces,
            direction: [playerDirection],
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

    function addFruit(command) {
        let fruitsLength = Object.keys(state.fruits).length
        const fruitId = command ? command.fruitId : 'fruit' + Math.floor(Math.random() * 9999)
        const fruitColor = command ? command.fruitColor : state.fruitColor
        const fruitPosition = command ? command.fruitPosition : randomPosition () 

        state.fruits[fruitId] = {
            color: fruitColor,
            length: fruitsLength,
            x: fruitPosition.x,
            y: fruitPosition.y
        }
    }

    function removeFruit(command) {
        const fruitId = command.fruitId
        delete state.fruits[fruitId]
    }

    function checkForFruitCollision(playerId) {
        //console.log('fruit collision');
        const player = state.players[playerId]
        const theHead = player.pieces[0]
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            if (theHead.x === fruit.x && theHead.y === fruit.y) {
                //audioFruit.play()
                removeFruit({ fruitId: fruitId })
                console.log(`Removed fruit ${fruitId}`);
                player.length += 1
                player.score += 50
                addFruit()
                console.log('add fruit')
//                clearInterval(TimerMovePlayer)
//                state.speed = state.speed * 0.95
//                if (state.speed < 10) {
//                    state.speed = startSpeed
//                }
//                TimerMovePlayer = setInterval(movePlayers, state.speed);
            }
        }
    }

    function randomPosition() {
        const newX = Math.floor(Math.random() * (state.screen.width))
        const newY = Math.floor(Math.random() * (state.screen.height))

        TestIfAnyCollision: {
            for (const eachPlayerID in state.players) {
                const eachPlayer = state.players[eachPlayerID]
                for (const eachPiece of eachPlayer.pieces) {
                    if (newX === eachPiece.x && newY === eachPiece.y) {
                        randomPosition()
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
        const theHead = state.players[playerId].pieces[0]
        const thePieces = state.players[playerId].pieces

        search: {
            for (const aPlayerId in state.players) {
                const aPlayer = state.players[aPlayerId]
                const aPlayerPiece = aPlayer.pieces
                for (let i = 0; i < aPlayerPiece.length; i++) {
                    if ( thePlayerId === aPlayerId && i === 0) { 
                        continue
                    } 

                    //console.log(i)
                    //console.log(aPlayerId)
                    //console.log(state.players)
                    //console.log(aPlayer)
                    //console.log(aPlayer.pieces)
                    //console.log(aPlayerPiece[i])

                    if (theHead.x === aPlayerPiece[i].x && theHead.y === aPlayerPiece[i].y) { //Colisão!
                        //audioGameOver.play()
                        if (thePlayerId !== aPlayerId && i !== 0) {
                            //aPlayerPiece.length += (thePieces.length - 1)
                            console.log('Antes:');
                            console.log(state.players[thePlayerId].pieces);
                            state.players[aPlayerId].pieces = aPlayerPiece.concat(thePieces) 
                            console.log('Depois');
                            console.log(state.players[thePlayerId].pieces)
                        
                        }   

                        /*
                        console.log('Before:')
                        console.log(thePieces.length);
                        console.log(thePieces);
                        */
                        
                        state.players[thePlayerId].pieces.length = 1
                        
                        /* console.log('After: ');
                        console.log(thePieces.length);
                        console.log(state.players[thePlayerId].pieces.length)
                        console.log(thePieces);
                        console.log(state.players[thePlayerId].pieces)
                        */

                        state.players[thePlayerId].score = 0
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
                    if (lenDirections > 1 || state.changeDirectionRequest === true) {
                        player.direction.push('ArrowUp')
                    }
                    else {
                        player.direction[0] = 'ArrowUp'
                        state.changeDirectionRequest = true
                    }
                }
            },
            ArrowDown(player) {
                let lenDirections = player.direction.length
                if (player.direction[lenDirections - 1] !== 'ArrowUp' && player.direction[lenDirections - 1] !== 'ArrowDown') {
                    if (lenDirections > 1 || state.changeDirectionRequest === true) {
                        player.direction.push('ArrowDown')
                    }
                    else {
                        player.direction[0] = 'ArrowDown'
                        state.changeDirectionRequest = true
                    }
                }
            },
            ArrowLeft(player) {
                let lenDirections = player.direction.length
                if (player.direction[lenDirections - 1] !== 'ArrowRight' && player.direction[lenDirections - 1] !== 'ArrowLeft') {
                    if (lenDirections > 1 || state.changeDirectionRequest === true) {
                        player.direction.push('ArrowLeft')
                    }
                    else {
                        player.direction[0] = 'ArrowLeft'
                        state.changeDirectionRequest = true
                    }
                }
            },
            ArrowRight(player) {
                let lenDirections = player.direction.length
                if (player.direction[lenDirections - 1] !== 'ArrowLeft' && player.direction[lenDirections - 1] !== 'ArrowRight') {
                    if (lenDirections > 1 || state.changeDirectionRequest === true) {
                        player.direction.push('ArrowRight')
                    }
                    else {
                        player.direction[0] = 'ArrowRight'
                        state.changeDirectionRequest = true
                    }

                }
            /*
            },
            Escape(player) {
                if (state.gameOver === false) {
                    if (state.pause === false) {
                        state.pause = true;
                        //renderScreen (screen, game)
                        clearInterval(TimerMovePlayer)
                        //clearInterval(TimerRenderScreen)
                    }
                    else {
                        state.pause = false
                        TimerMovePlayer = setInterval(movePlayers, state.speed);
                        //TimerRenderScreen = setInterval ( function() { requestAnimationFrame( function() { renderScreen (screen, game) } ) } , 10);                  
                    }
                }
            */
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

        const command = {
            type: 'move-players',
            state: state
        }
        notifyAll(command)

        for (const playerId in state.players) {

            state.changeDirectionRequest = false
            const player = state.players[playerId]
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
    }

    return {
        setState,
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
