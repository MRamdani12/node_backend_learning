const http = require("node:http");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");

class Butler {
  constructor() {
    this.server = http.createServer();
    this.routes = {};
    this.server.on("request", (req, res) => {
      res.sendFile = async (filePath, mime) => {
        const fileHandle = await fs.open(filePath, "r");
        const fileReadStream = fileHandle.createReadStream();

        res.setHeader("content-type", mime);
        await pipeline(fileReadStream, res);
        return res;
      };

      res.status = (statusCode) => {
        res.statusCode = statusCode;
        return res;
      };

      res.json = (object) => {
        const json = Buffer.from(JSON.stringify(object), "utf-8");

        res.setHeader("content-type", "application.json");
        if (json.byteLength < res.writableHighWaterMark) {
          res.end(json);
        }

        return res;
      };

      // Checking if the route exist on the routes object
      if (!this.routes[req.method.toLowerCase() + req.url]) {
        console.error(
          `No routes found for ${req.method.toLowerCase() + req.url}`,
        );
        res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });
      } else {
        this.routes[req.method.toLowerCase() + req.url](req, res);
      }
    });
  }

  route(method, url, cb) {
    this.routes[method.toLowerCase() + url] = cb;
  }

  listen(port, hostname, cb) {
    this.server.listen(port, hostname, () => {
      cb();
    });
  }

  address() {
    return this.server.address();
  }
}

module.exports = Butler;
