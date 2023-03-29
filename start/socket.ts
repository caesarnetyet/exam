import Ws from "App/Services/Ws";
import { Socket } from "socket.io";
Ws.boot();

const connectedUsers: string[] = [];
/**
 * Listen for incoming socket connections
 */
Ws.io.on("connection", (socket) => {
  connectedUsers.push(socket.id);
  socket.on("disconnect", () => {
    connectedUsers.splice(connectedUsers.indexOf(socket.id), 1);
  });
  console.log(connectedUsers);

  socket.emit("activeUsers", () => connectedUsers);
});
