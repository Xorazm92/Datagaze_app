
const socket = io('http://0.0.0.0:3000/terminal', {
  auth: {
    token: localStorage.getItem('token')
  },
  transports: ['websocket'],
  autoConnect: true
});

socket.on('connect', () => {
  console.log('Connected to terminal server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

socket.on('command_response', (data) => {
  if (data.success) {
    console.log('Command output:', data.result);
  } else {
    console.error('Command error:', data.result);
  }
});

function sendCommand(command) {
  socket.emit('command', { command });
}
const terminal = new Terminal();
const fitAddon = new FitAddon.FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal'));
fitAddon.fit();

const socket = io('http://0.0.0.0:3000/terminal', {
    auth: { token: localStorage.getItem('token') },
    transports: ['websocket']
});

let currentCommand = '';
let commandHistory = [];
let historyIndex = -1;

terminal.onKey(({ key, domEvent }) => {
    const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

    if (domEvent.keyCode === 13) { // Enter
        terminal.write('\r\n');
        if (currentCommand.trim().length > 0) {
            sendCommand(currentCommand);
            commandHistory.push(currentCommand);
            historyIndex = commandHistory.length;
        }
        currentCommand = '';
    } else if (domEvent.keyCode === 8) { // Backspace
        if (currentCommand.length > 0) {
            currentCommand = currentCommand.slice(0, -1);
            terminal.write('\b \b');
        }
    } else if (printable) {
        currentCommand += key;
        terminal.write(key);
    }
});

function sendCommand(command, agentId = null) {
    socket.emit('command', { command, agentId });
}

function installProduct(agentId, productId, version) {
    socket.emit('install_product', { agentId, productId, version });
}

socket.on('command_response', (data) => {
    if (data.success) {
        terminal.writeln(data.result);
    } else {
        terminal.writeln(`Error: ${data.result}`);
    }
});

socket.on('install_response', (data) => {
    if (data.success) {
        terminal.writeln('Product installation successful');
        terminal.writeln(data.result);
    } else {
        terminal.writeln(`Installation failed: ${data.error}`);
    }
});
