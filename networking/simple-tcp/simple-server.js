const net = require("net");

const PORT = 8080;
const HOST = "127.0.0.1";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log(data.toString("utf-8"));
  });
});

server.listen(PORT, HOST, () => {
  console.log("Server is running on", server.address());
});
