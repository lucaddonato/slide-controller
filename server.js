const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let slideAtual = 0;

const slides = require("./slides");

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Usuário conectado");

  // Envia o slide atual quando alguém entra
  socket.emit("updateSlide", slides[slideAtual]);

  socket.on("next", () => {
    if (slideAtual < slides.length - 1) slideAtual++;
    io.emit("updateSlide", slides[slideAtual]);
  });

  socket.on("prev", () => {
    if (slideAtual > 0) slideAtual--;
    io.emit("updateSlide", slides[slideAtual]);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});