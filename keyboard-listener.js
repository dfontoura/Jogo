export default function createKeyboardListener() {

    const state = {
        observers: []
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
        playerID: 'player1', 
        keyPressed
    }

    notifyAll(command);
    }

    return {
        subscribe
    }

}
