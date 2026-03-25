const http = require("http");

const PORT = 8080;

// IP of the current local network
const HOST = "10.184.55.132";

const server = http.createServer((req, res) => {
  const data = { message: "Hellow There!" };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Connection", "close");
  res.statusCode = 200;
  res.end(JSON.stringify(data));
});

server.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
