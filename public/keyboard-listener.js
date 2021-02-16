export default function createKeyboardListener(document) {

    const state = {
        observers: [],
        playerId: null
    }


    function registerPlayerId(playerId) {
        state.playerId = playerId
    }


    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command){
        for (const observerfunction of state.observers){
            observerfunction(command);
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    function handleKeyDown(event){
    const keyPressed = event.key

    const command = {   
        type: 'change-direction',
        playerId: state.playerId, 
        keyPressed
    }

    notifyAll(command);
    }

    return {
        subscribe,
        registerPlayerId
    }

}
