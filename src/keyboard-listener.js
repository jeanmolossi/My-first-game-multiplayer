export default function createKeyboardListener(document){
  const state = {
    observers: [],
    playerId: null
  }

  function registerPlayer(playerId){
    state.playerId = playerId;
  }

  function subscribe( observerFunction ){
    state.observers.push(observerFunction);
  }

  function notifyAll( command ) {
    for( const observerFunction of state.observers ){
      observerFunction(command)
    }
  }

  function unsubscribe( observerFunction ){
    state.observers[observerFunction] = null
  }

  document.addEventListener( 'keydown', movePlayer );

  function movePlayer( event ){
    const command = {
      type: '@game/movePlayer',
      playerId: state.playerId,
      keyPressed: event.key
    }

    notifyAll(command);
  }

  document.addEventListener( 'touchstart', movePlayerButton )

  function movePlayerButton( event ) {
    console.log( event.path[0].id )
    const command = {
      type: '@game/movePlayer',
      playerId: state.playerId,
      keyPressed: event.path[0].id
    }
    notifyAll(command);
  }

  return {
    subscribe,
    unsubscribe,
    registerPlayer
  }
}