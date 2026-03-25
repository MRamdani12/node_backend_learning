const fs = require("node:fs/promises");
const { pipeline } = require("node:stream");

// Memory Usage: 100MB
// Execution Time: 270ms
// (async () => {
//     console.time('Copy')
//     const srcFile = await fs.readFile('../read-big/src.txt')
//     const destFile = await fs.open('./text-copy.txt', 'w');

//     await destFile.write(srcFile)
//     console.timeEnd('Copy')
//     setInterval(() => {}, 1000)
// })()

// Memory Usage: 15MB
// Execution Time: 320ms
// (async () => {
//   console.time("Copy");
//   const srcFile = await fs.open("../read-big/src.txt", "r");
//   const destFile = await fs.open("./text-copy.txt", "w");

//   let bytesRead = -1;

//   while (bytesRead !== 0) {
//     const readResult = await srcFile.read();
//     bytesRead = readResult.bytesRead;
//     if (bytesRead !== 16384) {
//       const indexOfLastRead = readResult.buffer.indexOf(0x00);
//       const newBuff = Buffer.alloc(indexOfLastRead);
//       readResult.buffer.copy(newBuff, 0, 0, indexOfLastRead);
//       destFile.write(newBuff);
//     } else {
//       await destFile.write(readResult.buffer);
//     }
//   }

//   console.timeEnd("Copy");
//   // setInterval(() => {}, 1000);
// })();

// Memory Usage: 17MB
// Execution Time: 94ms
(async () => {
  console.time("Copy");
  const srcFile = await fs.open("../read-big/src.txt", "r");
  const destFile = await fs.open("./text-copy.txt", "w");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  pipeline(readStream, writeStream, (err) => {
    console.log(err);
    console.timeEnd("Copy");
  });

  setInterval(() => {}, 1000);
})();
