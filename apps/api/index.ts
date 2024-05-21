import express from "express";
import cors from "cors";
import ws from "ws";

const port = process.env.PORT || 5001;
const app = express();

app.use(cors());

const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection", (socket: any) => {
  socket.on("message", (message: any) => {
    console.log(message.toString());
    socket.send(message.toString());
  });
});

const server = app.listen(port);

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket: any) => {
    wsServer.emit("connection", socket, request);
  });
});
