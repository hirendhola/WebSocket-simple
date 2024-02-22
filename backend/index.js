const http = require('http');
const WebSocketServer = require("websocket").server;

let connections = [];

const httpServer = http.createServer((req, res) => {
  console.log("we have received a req");
});

const webSocket = new WebSocketServer({
  httpServer: httpServer
});

webSocket.on("request", req => {
  const connection = req.accept(null, req.origin);
  connections.push(connection);

  connection.on("open", () => console.log("WebSocket connection opened"));
  connection.on("close", () => {
    console.log("WebSocket connection closed");
    connections = connections.filter(conn => conn !== connection);
  });

  connection.on("message", message => {
    if (message.type === 'utf8') {
      console.log(`Received message: ${message.utf8Data}`);[]
      connections.forEach(conn => {
        conn.send(message.utf8Data);
      });
    }
  });
  connection.send("Welcome to the chat!");
});

httpServer.listen(8080, () => {
  console.log("SERVER IS LISTENING ON 8080");
});
