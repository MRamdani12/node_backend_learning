const net = require("net");

const PORT = 8080;
const HOST = "127.0.0.1";

let clients = [];

const server = net.createServer((socket) => {
  console.log("A user just connected to the server");
  const clientId = clients.length + 1;

  // Broadcasting to every clients that a new user has joined in.
  clients.map((client) => {
    client.socket.write(`User ${clientId} has joined the chat!`);
  });

  // Send clientId back to the client
  socket.write(`id-${clientId}`);

  // Broadcasting to every clients that a message has ben sent to the chat room

  socket.on("data", (data) => {
    const dataSplit = data.toString().split("-message-");
    const id = dataSplit[0];
    const message = dataSplit[1];

    clients.map((client) => {
      client.socket.write(`User ${id}: ${message}`);
    });
  });

  socket.on("error", () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} has left the chat`);
    });
    clients = clients.filter((client) => client.id !== clientId);
  });

  clients.push({ id: clientId, socket });
});

server.listen(PORT, HOST, () => {
  console.log("Server is running on:", server.address());
});
