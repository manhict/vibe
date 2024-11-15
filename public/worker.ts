// public/progressWorker.js
let socket: any = null;

onmessage = function (e) {
  const { action, socketRef, currentTime } = e.data;

  // Initialize socket connection when worker is initialized
  if (action === "initializeSocket") {
    socket = socketRef;
  }

  // Emit progress every 2 seconds
  if (action === "startEmitting") {
    setInterval(() => {
      if (socket && socket.connected) {
        socket.emit("progress", currentTime);
      }
    }, 2000);
  }
};
