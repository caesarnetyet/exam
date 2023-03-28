import Ws from "App/Services/Ws";
import { Socket } from "socket.io";
Ws.boot();

const connectedUsers: { [key: string]: Socket } = {} 
/**
 * Listen for incoming socket connections
 */
Ws.io.on("connection", (socket) => {
  connectedUsers[socket.id] = socket;  
  socket.on("message", (data) => {
    setTimeout(() => {
      socket.emit("news", data);
    }, 5000);
  });
  socket.on("disconnect", () => {
    delete connectedUsers[socket.id];
  });
});
