const { parentPort } = require("worker_threads");
const { performance } = require("node:perf_hooks");

parentPort.on("message", (msg) => {
  const start = performance.now();
  for (let i = 0; i <= msg.count; ++i) {}
  console.log(`${performance.now() - start}ms`);
  parentPort.postMessage({
    message: `Calculated, time: ${performance.now() - start}ms`,
  });
});
