export default function renderScreen( screen, game, requestAnimationFrame, currentPlayerId ){
  const context = screen.getContext('2d');
  context.clearRect(0,0,40,30);
  
  for(const playerRendering in game.state.players ){
    const player = game.state.players[playerRendering];
    context.fillStyle = playerRendering === 'current' ? 'lightblue': 'black';
    context.opacity = 0.1
    context.fillRect( player.x, player.y, 1, 1);
  }
  
  for(const fruitRendering in game.state.fruits ){
    const fruit = game.state.fruits[fruitRendering];
    context.fillStyle = 'green';
    context.fillRect( fruit.x, fruit.y, 1, 1);
  }

  const currentPlayer = game.state.players[currentPlayerId]

  if( currentPlayer ) {
    context.fillStyle = 'lightblue';
    context.fillRect(currentPlayer.x, currentPlayer.y, 1 ,1)
  }

  requestAnimationFrame(() => renderScreen(screen, game, requestAnimationFrame, currentPlayerId))
}