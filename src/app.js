const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const server = express();
const httpServer = new HttpServer(server);
const io = new IOServer(httpServer);
const api = require("./script");
const products = api.products;

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");
  socket.emit("messages", products);

  socket.on("new-message", (data) => {
    products.push(data);
    io.sockets.emit("messages", products);
  });
});

server.use(express.static("public"));
server.use("/api/productos", api.router);

server.set("views", "./views");
server.set("view engine", "ejs");

// server.get("/", (req, res) => {
//   res.render("form", { products });
// });

module.exports = httpServer;
