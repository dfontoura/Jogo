//export default 
function renderScreen(screen, game) //, requestAnimationFrame)
{
    const context = screen.getContext('2d')
    context.clearRect (0,0, screen.width, screen.height);
    
    for (const playerID in game.state.players){
        const player = game.state.players[playerID]
     
        for (const playerPiece in game.state.players[playerID].pieces) {
            if (playerPiece === '0') {   //The head has a different color
                context.globalAlpha = 1.0
            }
            else { 
                context.globalAlpha = 0.85 
            }
            context.fillStyle = player.color;
            context.fillRect(player.pieces[playerPiece].x , player.pieces[playerPiece].y , 1 , 1);
        }
    }

    for(const fruitID in game.state.fruits){
        const fruit = game.state.fruits[fruitID];
        context.globalAlpha = 1.0
        context.fillStyle= fruit.color;
        context.fillRect(fruit.x , fruit.y , 1 , 1);
    }

    footerScore.textContent = 'Pontuação: ' + score
    
    if (game.state.pause === true) {
        writePauseOnScreen()
    }

    function writePauseOnScreen(){
        context.fillStyle = 'gray';
        //P:
        context.globalAlpha = 0.9
        context.fillRect(0 , 5 , 1 , 5);
        context.fillRect(1 , 5 , 2 , 1);
        context.fillRect(2 , 6 , 1 , 1);
        context.fillRect(1 , 7 , 2 , 1);

        //A:
        context.globalAlpha = 0.7
        context.fillRect(3 , 5 , 1 , 5);
        context.fillRect(4 , 5 , 1 , 1);
        context.fillRect(4 , 7 , 1 , 1);
        context.fillRect(5 , 5 , 1 , 5);

        //U:
        context.globalAlpha = 0.9
        context.fillRect(6 , 5 , 1 , 5);
        context.fillRect(7 , 9 , 1 , 1);
        context.fillRect(8 , 5 , 1 , 5);

        //S:
        context.globalAlpha = 0.7
        context.fillRect(9 , 5 , 3 , 1);
        context.fillRect(9 , 6 , 1 , 1);
        context.fillRect(9 , 7 , 3 , 1);
        context.fillRect(11 , 8 , 1 , 1);
        context.fillRect(9 , 9 , 3 , 1);

        //E:
        context.globalAlpha = 0.9
        context.fillRect(12 , 5 , 1 , 5);
        context.fillRect(13 , 5 , 2 , 1);
        context.fillRect(13 , 7 , 1 , 1);
        context.fillRect(13 , 9 , 2 , 1);

    }


}
