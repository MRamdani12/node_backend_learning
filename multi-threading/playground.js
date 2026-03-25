const http = require("node:http");
const { Worker } = require("worker_threads");

const server = http.createServer();

server.on("request", (req, res) => {
  if (req.url === "/calc" && req.method === "GET") {
    const count = 100_000_000_00;
    const thread = new Worker("./worker.js");
    let workerMsg;

    thread.postMessage({ count });

    thread.on("message", (msg) => {
      workerMsg = msg;
      return res.end(JSON.stringify(workerMsg));
    });
  } else {
    res.end(JSON.stringify({ message: "Welcome!" }));
  }
});

server.listen(8000, "localhost", () => {
  console.log("Server is running on port 8000");
});
