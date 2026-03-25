const { parentPort } = require("worker_threads");
const generatePrimes = require("./lib/prime-generator");

parentPort.on("message", (data) => {
  let primes;
  primes = generatePrimes(data.count, data.startingNumber, {
    format: true,
  });
  console.log(primes);
  parentPort.postMessage(primes);
});
