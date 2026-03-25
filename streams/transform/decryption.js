const { Transform, pipeline } = require("node:stream");
const fs = require("node:fs/promises");

class Decryption extends Transform {
  constructor(srcFileSize) {
    super();
    this.srcFileSize = srcFileSize;
    this.buffRead = 0;
  }

  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; ++i) {
      chunk[i] -= 1;
    }
    this.push(chunk);
    this.buffRead += chunk.length;
    const percent = (this.buffRead / this.srcFileSize) * 100;
    process.stdout.write(`\rDecryption file... ${percent.toFixed(2)}%`);
    callback();
  }

  _flush(callback) {
    process.stdout.write("\nDecryption complete");
    callback();
  }
}

(async () => {
  const srcFile = await fs.open("./dest.txt", "r");
  const destFile = await fs.open("./decrypted.txt", "w");

  const srcFileSize = (await srcFile.stat()).size;

  const decrypt = new Decryption(srcFileSize);

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  pipeline(readStream, decrypt, writeStream, (err) => {
    if (err) console.log(err);
  });
})();
