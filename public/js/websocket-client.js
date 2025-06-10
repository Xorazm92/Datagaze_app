// Socket.IO client ni ulash
const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  autoConnect: true
});

// Ulanish hodisalari
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

// Xabarlarni qabul qilish
socket.on('notification', (data) => {
  console.log('Received notification:', data);
  // Bu yerda notification ni ko'rsatish logikasini yozing
  showNotification(data);
});

// Xabar yuborish funksiyasi
function sendNotification(message) {
  socket.emit('sendNotification', {
    message: message,
    timestamp: new Date()
  });
}

// Notification ko'rsatish funksiyasi
function showNotification(data) {
  // Bu yerda o'zingizning notification UI logikangizni yozing
  // Masalan:
  const notificationDiv = document.createElement('div');
  notificationDiv.classList.add('notification');
  notificationDiv.textContent = data.message;
  document.body.appendChild(notificationDiv);
  
  // 5 sekunddan keyin notification ni o'chirish
  setTimeout(() => {
    notificationDiv.remove();
  }, 5000);
}
