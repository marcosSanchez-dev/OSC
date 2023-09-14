const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const osc = require("node-osc");

const app = express();

// Sirve todos los archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const oscClient = new osc.Client("127.0.0.1", 8010);

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    try {
      const oscMessage = JSON.parse(message);
      oscClient.send(oscMessage.address, ...oscMessage.args);
    } catch (error) {
      console.error("Error al procesar el mensaje:", error);
    }
  });
});

server.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});
