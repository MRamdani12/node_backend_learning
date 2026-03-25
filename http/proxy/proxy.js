const http = require("node:http");
const { pipeline } = require("node:stream/promises");

const proxy = http.createServer();

const SERVERS = [
  { PORT: 9001, hostname: "localhost" },
  { PORT: 9002, hostname: "localhost" },
  { PORT: 9003, hostname: "localhost" },
];

proxy.on("request", async (clientRequest, proxyResponse) => {
  // Getting the first item in the SERVERS array and put it back at the end of the array (Round-robin Algorithm)
  const currentServer = SERVERS.shift();
  SERVERS.push(currentServer);

  // Making a request to the servers by using currentServer and the clientRequest for the path and method
  const serverRequest = http.request({
    hostname: currentServer.hostname,
    port: currentServer.PORT,
    path: clientRequest.url,
    method: clientRequest.method,
    headers: clientRequest.headers,
  });

  // Error checking
  serverRequest.on("error", (err) => {
    console.error(`Problem with request: ${err}`);
    proxyResponse.writeHead(500, { "content-type": "application/json" });
    proxyResponse.end(JSON.stringify({ error: "Internal Server Error" }));
  });

  await pipeline(clientRequest, serverRequest);

  serverRequest.end();

  serverRequest.on("response", async (response) => {
    proxyResponse.writeHead(response.statusCode, response.headers);
    await pipeline(response, proxyResponse);
  });

  // proxyResponse.end(JSON.stringify({ message: "Success" }));
});

proxy.listen(9000, "localhost", () => {
  console.log("Proxy server is running on: ", proxy.address());
});
