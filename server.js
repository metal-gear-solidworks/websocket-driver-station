// Basic WebSocket server for broadcasting Xbox inputs
// Tyler Chen

const WebSocket = require('ws');
let gamepad = require('gamepad');

gamepad.init();

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

setInterval(gamepad.detectDevices, 500);

let wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (socket) => {
    console.log("Client has connected");
});

let readGamepad = () => {
    gamepad.processEvents();
    if (gamepad.numDevices() > 0) {
        let state = gamepad.deviceAtIndex(0);
        analog = state.axisStates;
        buttons = state.buttonStates;
    }

    else {
        analog.fill(0);
        buttons.fill(false);
    }
}

setInterval(readGamepad, 16);

let broadcast = () => {
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify({ axisStates: analog, buttonStates: buttons }));
    });
}

setInterval(broadcast, 50);