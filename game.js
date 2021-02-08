//export default 
function createGame({screenWidth, screenHeight}){
    const state = {
        players: {},
        fruits: {},
        screen: {width: screenWidth, height: screenHeight},
        pause: false,
        changeDirectionRequest: false
    }


    function addPlayer(command) {
        const playerID = command.playerID
        const playerColor = command.playerColor
        const playerPieces = command.playerPieces
        const playerDirection = command.playerDirection

        state.players[playerID] = {
            color: playerColor,
            length: playerPieces.length,
            pieces: playerPieces,
            direction: playerDirection
        }
    }

    function removePlayer(command) {
        const playerID = command.playerID

        delete state.players[playerID]
    }

    function addFruit(command) {
        const fruitID = command.fruitID
        const fruitColor = command.fruitColor
        const fruitX = command.fruitX
        const fruitY = command.fruitY

        state.fruits[fruitID] = {
            color: fruitColor,
            x: fruitX,
            y: fruitY
        }
    }

    function removeFruit(command) {
        const fruitID = command.fruitID
        delete state.fruits[fruitID]
    }

    function checkForFruitCollision(playerID) {
        player = state.players[playerID]
        theHead = player.pieces[0]
        for (const fruitID in state.fruits) {
            const fruit = state.fruits[fruitID]
            if (theHead.x === fruit.x && theHead.y === fruit.y) {
                audioFruit.play()
                fruitColor = state.fruits[fruitID].color
                removeFruit({ fruitID: fruitID })
                player.length += 1
                score += 1
                newFruit = randomFruit()
                addFruit({fruitID: newFruit.fruitName, fruitColor: fruitColor, fruitX: newFruit.x, fruitY: newFruit.y})
                clearInterval(TimerMovePlayer)
                speed = speed * 0.95
                TimerMovePlayer = setInterval(movePlayers, speed) ;
            }
        }

        function randomFruit(){
            newFruitX = Math.floor(Math.random() * (state.screen.width))
            newFruitY = Math.floor(Math.random() * (state.screen.height))
            newFruitName = 'fruit1'

            TestIfAnyCollision: {
                for (const eachPlayerID in state.players){
                    eachPlayer = state.players[eachPlayerID]
                    for (const eachPiece of eachPlayer.pieces){
                        if (newFruitX === eachPiece.x && newFruitY === eachPiece.y){
                            randomFruit()
                            break TestIfAnyCollision
                        } 
                    }
                }
            }

            x = newFruitX
            y = newFruitY
            fruitName = newFruitName
        
            return {
                x,
                y,
                fruitName
            }
        }



    }

    function checkForSelfCollision(playerID) {
        player = state.players[playerID]
        playerPiece = player.pieces
        theHead = player.pieces[0]
        for (let i = 1 ; i < player.pieces.length ; i++) {
            if (theHead.x === playerPiece[i].x && theHead.y === playerPiece[i].y) {
                audioGameOver.play()
                player.color='gray'
                state.fruits['fruit1'].color = 'gray'
                renderScreen (screen, game)
                gameOver = true
                clearInterval(TimerMovePlayer)
                clearInterval(TimerRenderScreen)
            }
        }
    }




    function changeDirection(command){

        const aceptedKeys = {
            ArrowUp(player) {
                let lenDirections = player.direction.length
                if (player.direction[lenDirections - 1] !== 'ArrowDown' && player.direction[lenDirections - 1] !== 'ArrowUp'  ) {
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
                if (player.direction[lenDirections - 1] !== 'ArrowUp' && player.direction[lenDirections - 1] !== 'ArrowDown'  ) {
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
                if (player.direction[lenDirections - 1] !== 'ArrowRight' && player.direction[lenDirections - 1] !== 'ArrowLeft'  ) {
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
                if (player.direction[lenDirections - 1] !== 'ArrowLeft' && player.direction[lenDirections - 1] !== 'ArrowRight'  ) {
                    if (lenDirections > 1 || state.changeDirectionRequest === true) {
                        player.direction.push('ArrowRight')
                    } 
                    else {
                        player.direction[0] = 'ArrowRight'
                        state.changeDirectionRequest = true
                    }

                }
            },
            Escape(player) {
                if (gameOver === false) {
                    if (state.pause === false) {
                        state.pause = true;
                        renderScreen (screen, game)
                        clearInterval(TimerMovePlayer)
                        clearInterval(TimerRenderScreen)
                    }
                    else {
                        state.pause = false
                        TimerMovePlayer = setInterval(movePlayers, speed) ;
                        TimerRenderScreen = setInterval ( function() { requestAnimationFrame( function() { renderScreen (screen, game) } ) } , 10);                  
                    }
                }
            }
        }    
                               
        const keyPressed = command.keyPressed
        const playerID = command.playerID
        const player = state.players[playerID]
        
        const changeDirectionFunction = aceptedKeys[keyPressed]
        if (player && changeDirectionFunction) {
            changeDirectionFunction(player)
        }


        return 
        
    }


    function movePlayers(){
        
        for (playerID in state.players){
            state.changeDirectionRequest = false
            player = state.players[playerID]
            theHead = player.pieces[0]
            playerLength = player.length
            playerPieces = player.pieces
            playerDirection = player.direction
        


            const aceptedDirections = {
                ArrowUp(player) {
                    if(theHead.y > 0) {
                        playerPieces.unshift({x: theHead.x, y: theHead.y-1})
                    }
                    else {
                        playerPieces.unshift({x: theHead.x, y: state.screen.height-1})
                    }
                    
                    if (playerLength < playerPieces.length) {
                            player.pieces.pop()
                    }
                },
                
                ArrowDown(player) {

                    if(theHead.y < state.screen.height-1) {
                        playerPieces.unshift({x: theHead.x, y: theHead.y + 1})
                    }
                    else {
                        playerPieces.unshift({x: theHead.x, y: 0})
                    }
                    if (playerLength < playerPieces.length) {
                            player.pieces.pop()
                    }
                },

                ArrowLeft(player) {
                    if(theHead.x > 0) {
                        playerPieces.unshift({x: theHead.x - 1 , y: theHead.y})
                    }
                    else {
                        playerPieces.unshift({x: state.screen.width - 1, y: theHead.y})
                    }
                    if (playerLength < playerPieces.length) {
                            player.pieces.pop()
                    }
                },

                ArrowRight(player) {
                    if(theHead.x < state.screen.width - 1) {
                        playerPieces.unshift({x: theHead.x + 1 , y: theHead.y})

                    }
                    else {
                        playerPieces.unshift({x: 0, y: theHead.y})
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

            checkForFruitCollision(playerID)
            checkForSelfCollision(playerID)

        }
    }    
    
    return{
            changeDirection,
            movePlayers,
            addPlayer,
            removePlayer,
            addFruit,
            removeFruit,
            state,
            checkForFruitCollision,
            checkForSelfCollision
    }
    

}
