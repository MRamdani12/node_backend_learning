const { Readable } = require("node:stream");
const fs = require("node:fs");

class FileReadStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) return callback(err);
      this.fd = fd;
      callback();
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);

    fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _destroy(ERR, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => callback(err || ERR));
    } else {
      callback(ERR);
    }
  }
}

const FileWriteStream = require("../custom-writable/customWritable");

(async () => {
  const streamRead = new FileReadStream({ fileName: "./text.txt" });
  const streamWrite = new FileWriteStream({ fileName: "./dest.txt" });

  streamRead.on("data", (chunk) => {
    console.log(chunk);
    const chunkArr = chunk.toString("utf-8").split("  ");
    chunkArr.forEach((i) => {
      if (Number(i) % 2 === 0)
        if (!streamWrite.write(` ${i} `)) {
          streamRead.pause();
        }
    });
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });
})();
