const cluster = require("node:cluster");

if (cluster.isPrimary) {
  const cores = require("os").availableParallelism();

  for (let i = 0; i < cores; ++i) {
    cluster.fork();
  }
  console.log("This is a parent process");
} else {
  require("./server.js");
}
