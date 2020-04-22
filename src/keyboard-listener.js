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

  document.addEventListener( 'keydown', movePlayer );

  function movePlayer( event ){
    const command = {
      type: '@game/movePlayer',
      playerId: state.playerId,
      keyPressed: event.key
    }

    notifyAll(command);
  }

  return {
    subscribe,
    registerPlayer
  }
}