export default function renderScreen(screen, state, scorePanel, highScorePanel, currentPlayerId) {

    let ranking = []

    const context = screen.getContext('2d')
    context.clearRect (0,0, screen.width, screen.height);
    
    for (const playerId in state.players){
        const player = state.players[playerId]

        console.log(playerId);
        ranking.push({playerId: playerId, playerName: player.name, score: player.score})
     
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

            
            
            context.fillRect(player.pieces[playerPiece].x , player.pieces[playerPiece].y , 1 , 1);
        }
    }

    for(const fruitId in state.fruits){
        const fruit = state.fruits[fruitId];
        context.globalAlpha = 1.0
        context.fillStyle= fruit.color;
        context.fillRect(fruit.x , fruit.y , 1 , 1)
    }

    ranking.sort( (a,b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0 )

    console.log(ranking);
    console.log('teste');
    
    scorePanel.innerHTML = ''
    for (let eachPlayer of ranking) {
        if (eachPlayer.playerId === currentPlayerId ){
            scorePanel.innerHTML += `<p> <strong> ${eachPlayer.playerName}: ${eachPlayer.score} </strong> </p>`
        }
        else {
            scorePanel.innerHTML += `<p> ${eachPlayer.playerName}: ${eachPlayer.score} </p>`
        }
    }
    scorePanel.innerHTML += `<p> </p>`

    highScorePanel.innerHTML = `<strong> High Score: ${state.highScore.score} (${state.highScore.playerName}) </strong>` 
    


}
