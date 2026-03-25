const http = require("node:http");

const server = http.createServer((req, res) => {
  console.log("-------- METHOD: --------");
  console.log(req.method);

  console.log("-------- HEADERS: --------");
  console.log(req.headers);

  console.log("-------- URL: --------");
  console.log(req.url);

  console.log("-------- BODY: --------");
  req.on("data", (chunk) => {
    console.log(chunk.toString("utf-8"));
  });

  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ message: "this is a response from the server" }));
});

server.listen(8000, () => {
  console.log(`HTTP server is running on http://localhost:8000`);
});
