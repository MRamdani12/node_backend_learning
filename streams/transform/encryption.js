const { Transform, pipeline } = require("node:stream");
const fs = require("node:fs/promises");

class Encryption extends Transform {
  constructor(srcFileSize) {
    super();
    this.srcFileSize = srcFileSize;
    this.buffRead = 0;
  }

  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; ++i) {
      chunk[i] += 1;
    }
    this.push(chunk);
    this.buffRead += chunk.length;
    const percent = (this.buffRead / this.srcFileSize) * 100;
    process.stdout.write(`\rEncrypting file... ${percent.toFixed(2)}%`);
    callback();
  }

  _flush(callback) {
    process.stdout.write("\nEncryption complete");
    callback();
  }
}

(async () => {
  const srcFile = await fs.open("./src.txt", "r");
  const destFile = await fs.open("./dest.txt", "w");
  // console.log((await srcFile.stat()).size);

  const srcFileSize = (await srcFile.stat()).size;

  const encrypt = new Encryption(srcFileSize);

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  pipeline(readStream, encrypt, writeStream, (err) => {
    if (err) console.log(err);
  });
})();
