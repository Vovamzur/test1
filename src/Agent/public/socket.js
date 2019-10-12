const socket = io.connect('http://localhost:3000', { reconnection: true });

socket.on('connect', () => {
  console.log('connected');
});
