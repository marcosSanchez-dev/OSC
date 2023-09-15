const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const osc = require("node-osc");

const app = express();

// Sirve todos los archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const oscClient8010 = new osc.Client("127.0.0.1", 8010);
const oscClient7099 = new osc.Client("127.0.0.1", 7099);

const oscServer = new osc.Server(7099, "0.0.0.0");

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    try {
      const oscMessage = JSON.parse(message);

      if (oscMessage.address.startsWith("/fixtures/Group-1/color")) {
        // Enviar mensajes de colores al puerto 8010
        oscClient8010.send(oscMessage.address, ...oscMessage.args);
      } else {
        // Otros mensajes se envían al puerto 7099
        oscClient7099.send(oscMessage.address, ...oscMessage.args);
      }
    } catch (error) {
      console.error("Error al procesar el mensaje:", error);
    }
  });
});

server.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});

// oscServer.on("message", function (msg, rinfo) {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify({ address: msg[0], value: msg[1] }));
//     }
//   });
// });
