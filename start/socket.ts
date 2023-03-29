import Ws from "App/Services/Ws";
Ws.boot();

const connectedUsers: string[] = [];
/**
 * Listen for incoming socket connections
 */
Ws.io.on("connection", (socket) => {
  connectedUsers.push(socket.id);

  socket.on("disconnect", () => {
    connectedUsers.splice(connectedUsers.indexOf(socket.id), 1);
    Ws.io.emit("connectedUsers", connectedUsers);
    console.log(connectedUsers);
  });

  console.log(connectedUsers);

  Ws.io.emit("connectedUsers", connectedUsers);

  socket.on("start", (startPosition: number) => {
    console.log("paso 2", startPosition);
    Ws.io.emit("boatPosition", startPosition);
  });
  socket.on("nextBoat", (nextNumber: number) => {
    Ws.io.emit("boatPosition", nextNumber);
  });
});
