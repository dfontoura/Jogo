export default function renderScreen(screen, state, scorePanel, currentPlayerId) //, requestAnimationFrame)
{
    const context = screen.getContext('2d')
    context.clearRect (0,0, screen.width, screen.height);
    
    for (const playerId in state.players){
        const player = state.players[playerId]
     
        for (const playerPiece in state.players[playerId].pieces) {
            if (playerPiece === '0') {   //The head has a different color
                context.globalAlpha = 0.80
            }
            else { 
                context.globalAlpha = 0.65 
            }
            if (currentPlayerId === playerId) {
                context.fillStyle = player.color;
            }
            else {
                context.fillStyle = 'grey';
            }
            console.log(player.pieces[playerPiece].x);
            console.log(player.pieces);
            console.log(playerPiece);
            
            
            context.fillRect(player.pieces[playerPiece].x , player.pieces[playerPiece].y , 1 , 1);
        }
    }

    for(const fruitId in state.fruits){
        const fruit = state.fruits[fruitId];
        context.globalAlpha = 1.0
        context.fillStyle= fruit.color;
        context.fillRect(fruit.x , fruit.y , 1 , 1)
    }

    console.log(currentPlayerId);
    
    console.log(state.players[currentPlayerId].score);
    scorePanel.textContent = 'Pontuação: ' + state.players[currentPlayerId].score
    


}
