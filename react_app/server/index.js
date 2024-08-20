import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: { origin: "http://localhost:3000" },
});


io.on("connection", (socket) => {
    socket.on('message', (roomid,msg) => {
        io.to(roomid).emit('message', msg);
    });
    socket.on('createroom', async (roomid) => {
        socket.join(roomid);
    });
});

httpServer.listen(3010);
