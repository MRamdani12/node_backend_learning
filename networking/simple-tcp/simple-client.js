const net = require("net");

const socket = net.createConnection({ host: "127.0.0.1", port: 8080 });

socket.on("connect", () => {
  socket.write(Buffer.from("This is a text", "utf-8"));
});
