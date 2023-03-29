import Ws from "App/Services/Ws";

Ws.boot();

const connectedUsers: string[] = [];
const boats: string[] = []
/**
 * Listen for incoming socket connections
 */
Ws.io.on("connection", (socket) => {
  connectedUsers.push(socket.id);
  

  socket.on("disconnect", () => {
    connectedUsers.splice(connectedUsers.indexOf(socket.id), 1);
    boats.splice(boats.indexOf(socket.id), 1);
    Ws.io.emit("connectedUsers", connectedUsers);
  });

  console.log("Connected users", connectedUsers.length);

  socket.on('myPosition', (position:number) => {
    console.log(position)
    if (boats.indexOf(socket.id) !== -1) {
      boats.splice(boats.indexOf(socket.id), 1);
    }
    boats[position] = socket.id
    console.log(boats)
  })
  

  Ws.io.emit("connectedUsers", connectedUsers);

  socket.on("start", (startPosition: number) => {
    console.log("paso 2", startPosition);
    Ws.io.emit("boatPosition", startPosition);
  });
  socket.on("nextBoat", (nextNumber: number) => {
    Ws.io.emit("boatPosition", nextNumber);
  });
});

