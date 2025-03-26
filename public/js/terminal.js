
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
