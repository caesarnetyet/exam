import Ws from "App/Services/Ws";
Ws.boot();

/**
 * Listen for incoming socket connections
 */
Ws.io.on("connection", (socket) => {
  console.log("connected");
  socket.on("message", (data) => {
    console.log(data);
    setTimeout(() => {
      socket.emit("news", data);
    }, 5000);
  });
});
