const http = require("node:http");

const server = http.createServer();

server.on("request", (req, res) => {
  console.log(req.url, req.method);
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "This is a message" }));
  }

  if (req.url === "/heavy" && req.method === "GET") {
    for (let i = 0; i < 700000; ++i) {
      console.log(i);
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "This is a message" }));
  }
});

server.listen(9000, "localhost", () => {
  console.log("Server is running on: ", server.address());
});
