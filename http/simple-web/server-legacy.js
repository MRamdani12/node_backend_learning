const http = require("node:http");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");

const server = http.createServer();

server.on("request", async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    try {
      const fileHandle = await fs.open("./public/index.html", "r");
      const fileReadStream = fileHandle.createReadStream();
      res.writeHead(200, {
        "content-type": "text/html",
      });
      await pipeline(fileReadStream, res);
    } catch (error) {
      console.error(error);
      const errorMsg = Buffer.from(
        JSON.stringify({ message: "Internal Server Error" }),
        "utf-8",
      );
      res.writeHead(500, {
        "content-type": "application/json",
        "content-length": errorMsg.byteLength,
      });
      res.end(errorMsg);
    }
  }

  if (req.url === "/styles.css" && req.method === "GET") {
    try {
      const fileHandle = await fs.open("./public/styles.css", "r");
      const fileReadStream = fileHandle.createReadStream();
      res.writeHead(200, {
        "content-type": "text/css",
      });
      await pipeline(fileReadStream, res);
    } catch (error) {
      console.error(error);
      const errorMsg = Buffer.from(
        JSON.stringify({ message: "Internal Server Error" }),
        "utf-8",
      );
      res.writeHead(500, {
        "content-type": "application/json",
        "content-length": errorMsg.byteLength,
      });
      res.end(errorMsg);
    }
  }

  if (req.url === "/index.js" && req.method === "GET") {
    try {
      const fileHandle = await fs.open("./public/index.js", "r");
      const fileReadStream = fileHandle.createReadStream();
      res.writeHead(200, {
        "content-type": "text/javascript",
      });
      await pipeline(fileReadStream, res);
    } catch (error) {
      console.error(error);
      const errorMsg = Buffer.from(
        JSON.stringify({ message: "Internal Server Error" }),
        "utf-8",
      );
      res.writeHead(500, {
        "content-type": "application/json",
        "content-length": errorMsg.byteLength,
      });
      res.end(errorMsg);
    }
  }
});

server.listen(8000, "localhost", () => {
  console.log(`Server is running on:`, server.address());
});
