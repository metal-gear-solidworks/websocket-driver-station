// Basic WebSocket client with failsafe and automatic reconnection
// Tyler Chen

const WebSocket = require('ws');

let analog = [0, 0, 0, 0, 0, 0, 0, 0];
let buttons = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
];

const heartbeat = () => {
    clearTimeout(this.pingTimeout);
    this.pingTimeout = setTimeout(() => {
        this.terminate();
    }, 500);
}

const failsafe = () => {
    analog.fill(0);
    buttons.fill(false);
    clearTimeout(this.pingTimeout);
    clearInterval(this.reconnectInterval);
    console.log("Failsafe initiated");
    this.reconnectInterval = setInterval(connect, 3000); 
}

const connect = () => {
    let ws = new WebSocket('ws://localhost:8080');

    ws.on('error', () => {
        console.log("Error connecting to server");
    });

    ws.on('open', () => {
        console.log("Connected to server");
        clearInterval(this.reconnectInterval);
        heartbeat();
    });

    ws.on('message', (data) => {
        heartbeat();
        let parsed = JSON.parse(data);
        analog = parsed.axisStates;
        buttons = parsed.buttonStates;
    });

    ws.on('close', () => {
        failsafe();
    });
}

connect();

const move = () => {
    // do something
}

setInterval(move, 40);