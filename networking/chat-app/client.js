const net = require("net");
const readline = require("node:readline/promises");

const PORT = 8080;
const HOST = "127.0.0.1";

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let id;

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  console.log("Connected to the server!");

  const ask = async () => {
    const message = await rl.question("Enter your message > ");
    await moveCursor(0, -1);
    await clearLine(0);
    socket.write(`${id}-message-${message}`);
  };

  ask();

  socket.on("data", async (data) => {
    console.log();
    await moveCursor(0, -1);
    await clearLine(0);
    if (data.toString().split("-")[0] === "id") {
      const clientId = data.toString().split("-")[1];
      id = clientId;
      console.log(`Your id is ${clientId}`);
    } else {
      console.log(data.toString());
    }
    ask();
  });
});

socket.on("end", () => {
  console.log("Connection was ended!");
});
