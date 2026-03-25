const { Duplex } = require("node:stream");
const fs = require("node:fs");

class DuplexStream extends Duplex {
  constructor({
    readableHighWaterMark,
    writableHighWaterMark,
    readFileName,
    writeFileName,
  }) {
    super({ readableHighWaterMark, writableHighWaterMark });
    this.readFileName = readFileName;
    this.writeFileName = writeFileName;
    this.chunks = [];
    this.chunksLength = 0;
    this.readFd = null;
    this.writeFd = null;
  }

  _construct(callback) {
    fs.open(this.readFileName, "r", (err, readFd) => {
      if (err) return callback(err);
      this.readFd = readFd;
      fs.open(this.writeFileName, "w", (err, writeFd) => {
        if (err) {
          // Callback with error will stop the stream immediately
          callback(err);
        } else {
          this.writeFd = writeFd;
          // No argument on callback function meaning that it was successful
          callback();
        }
      });
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksLength += chunk.length;
    if (this.chunksLength < this.writableHighWaterMark) {
      callback();
    } else {
      const buff = Buffer.concat(this.chunks);
      fs.write(this.writeFd, buff, (err) => {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      });
      this.chunks = [];
      this.chunksLength = 0;
    }
  }

  _read(size) {
    const buff = Buffer.alloc(size);

    fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _final(callback) {
    const buff = Buffer.concat(this.chunks);
    fs.write(this.writeFd, buff, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    });
    this.chunks = [];
  }

  _destroy(error, callback) {
    callback(error);
  }
}

const duplex = new DuplexStream({
  readFileName: "read.txt",
  writeFileName: "write.txt",
});

duplex.write(Buffer.from("Hello World!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"));
duplex.write(Buffer.from("Hello World!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"));
duplex.end(Buffer.from("Hello World!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"));

duplex.on("data", (chunk) => {
  console.log(chunk.toString());
});
