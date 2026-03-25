const Butler = require("./butler");

const server = new Butler();

server.route("GET", "/", (req, res) => {
  res.status(200).sendFile("./public/index.html", "text/html");
});

server.route("GET", "/styles.css", (req, res) => {
  res.status(200).sendFile("./public/styles.css", "text/css");
});

server.route("GET", "/index.js", (req, res) => {
  res.status(200).sendFile("./public/index.js", "text/javascript");
});

server.listen(8000, "localhost", () => {
  console.log(server.address());
});
