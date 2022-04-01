const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const fs = require("fs");
const server = express();
const httpServer = new HttpServer(server);
const io = new IOServer(httpServer);
const api = require("./script");
const products = api.products;

async function createIfNotExist() {
  let messages;
  try {
    messages = await fs.promises.readFile("./products.txt");
  } catch (error) {
    if (error.code == "ENOENT") {
      await fs.promises.writeFile("./products.txt", "[]").then(() => {
        console.log("No existe products.txt. Archivo creado.");
      });
      messages = await fs.promises.readFile("./products");
    } else {
      console.log("Hubo un error", error);
    }
  }
  return messages;
}

io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado");

  socket.emit("products", products);
  socket.on("new-products", (product) => {
    product.price = parseInt(product.price);

    if (!products.length) {
      product.id = 1;
    } else {
      product.id = products.at(-1).id + 1;
    }
    products.push(product);
    io.sockets.emit("products", products);
  });
  const messages = await createIfNotExist();
  const parsedMessages = JSON.parse(messages);

  socket.emit("messages", parsedMessages);
  socket.on("new-message", async (data) => {
    parsedMessages.push(data);
    io.sockets.emit("messages", parsedMessages);
    await fs.promises.writeFile(
      "./products.txt",
      JSON.stringify(parsedMessages)
    );
  });
});

server.use(express.static("public"));
server.use("/api/productos", api.router);

server.set("views", "./views");
server.set("view engine", "ejs");

server.get("/", (req, res) => {
  res.render("form");
});

module.exports = httpServer;
