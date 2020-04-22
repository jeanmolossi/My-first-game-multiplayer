export default function createGame(){
  const state = {
    canvasWidth: 39,
    canvasHeight: 29,
    players: {},
    fruits: {}
  }

  const observers = []

  function start() {
    const freq = 2 * 1000;

    setInterval( addFruit, freq );
  }

  function subscribe( observerFunction ){
    observers.push(observerFunction);
  }

  function notifyAll( command ) {
    for( const observerFunction of observers ){
      observerFunction(command)
    }
  }


  function setState(newState) {
    Object.assign(state, newState)
  }

  function addPlayer( playerInitialState ) {
    const playerId = playerInitialState.playerId;
    const playerX = 'playerX' in playerInitialState ? playerInitialState.playerX : Math.floor(Math.random() * state.canvasWidth) ;
    const playerY = 'playerY' in playerInitialState ? playerInitialState.playerY : Math.floor(Math.random() * state.canvasHeight) ;
    

    state.players[playerId] = {
      x: playerX,
      y: playerY
    }

    notifyAll({
      type: '@game/addPlayer',
      playerId,
      playerX,
      playerY
    })
  }

  function removePlayer(socketId){
    const playerId = socketId.playerId

    notifyAll({
      type: '@game/removePlayer',
      playerId
    })

    delete state.players[playerId];
  }

  function addFruit( fruitInitialState ) {
    const fruitId = fruitInitialState ? fruitInitialState.fruitId : Math.floor(Math.random() * 10000000);
    const fruitX = fruitInitialState ? fruitInitialState.fruitX : Math.floor(Math.random() * state.canvasWidth);
    const fruitY = fruitInitialState ? fruitInitialState.fruitY : Math.floor(Math.random() * state.canvasHeight);

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    }

    notifyAll({
      type: '@game/addFruit',
      fruitId,
      fruitX,
      fruitY
    })
  }

  function removeFruit(socketId){
    const fruitId = socketId.fruitId
    delete state.fruits[fruitId];

    notifyAll({
      type: '@game/removeFruit',
      fruitId
    })
  }
  
  function movePlayer( command ) {
    notifyAll(command)

    const acceptedMoves = {
      ArrowUp(player) {
        if( player.y - 1 >= 0 ) player.y -= 1; return
      },
      ArrowDown(player) {
        if( player.y + 1 <= state.canvasHeight ) player.y += 1; return
      },
      ArrowLeft(player) {
        if( player.x - 1 >= 0) player.x -= 1; return
      },
      ArrowRight(player) {
        if( player.x + 1 <= state.canvasWidth) player.x += 1; return
      },
    }

    const { playerId, keyPressed } = command;
    const player = state.players[playerId];
    const moveFunction = acceptedMoves[keyPressed]
    if( player && moveFunction )
      moveFunction(player);
      checkForFruitCollition(playerId);
    return
  }

  function checkForFruitCollition(playerId){      
    const player = state.players[playerId]

    for( const fruitId in state.fruits ){
      const fruit = state.fruits[fruitId];
      console.log(`Checking ${playerId} and ${fruitId}`);

      if( player.x === fruit.x && player.y === fruit.y ){
        console.log(`Colision detected between ${playerId} and ${fruitId}`);
        removeFruit({fruitId});
      }
    }
    
  }

  return {
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    movePlayer,
    checkForFruitCollition,
    setState,
    state,
    subscribe,
    start
  };
}