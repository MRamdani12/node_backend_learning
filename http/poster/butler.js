const http = require("node:http");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");

class Butler {
  constructor() {
    this.server = http.createServer();
    this.routes = {};
    this.middlewares = [];
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

        res.setHeader("content-type", "application/json");
        res.end(json);

        return res;
      };

      const loopMiddleware = (request, response, index) => {
        if (index !== this.middlewares.length) {
          this.middlewares[index](request, response, () => {
            loopMiddleware(request, response, index + 1);
          });
        } else {
          // Checking if the route exist on the routes object
          if (!this.routes[req.method.toLowerCase() + req.url]) {
            console.error(
              `No routes found for ${req.method.toLowerCase() + req.url}`,
            );
            return res
              .status(404)
              .json({ message: `Cannot ${req.method} ${req.url}` });
          }
          this.routes[req.method.toLowerCase() + req.url](req, res);
        }
      };

      loopMiddleware(req, res, 0);
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

  beforeEach(cb) {
    this.middlewares.push(cb);
  }
}

module.exports = Butler;
