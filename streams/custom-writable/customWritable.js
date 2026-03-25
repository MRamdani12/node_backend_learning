const fs = require("node:fs");
const { Writable } = require("node:stream");

class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = 0;
    this.chunks = [];
    this.chunksLength = 0;
    this.numberOfWrites = 0;
  }

  // This will run after the constructor, and it will halt from calling all the other methods until we call the callback function.
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        // Callback with error will stop the stream immediately
        callback(err);
      } else {
        this.fd = fd;
        // No argument on callback function meaning that it was successful
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksLength += chunk.length;
    if (this.chunksLength < this.highWaterMark) {
      callback();
    } else {
      const buff = Buffer.concat(this.chunks);
      fs.write(this.fd, buff, (err) => {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      });
      ++this.numberOfWrites;
      this.chunks = [];
      this.chunksLength = 0;
    }
  }

  _final(callback) {
    const buff = Buffer.concat(this.chunks);
    fs.write(this.fd, buff, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    });
    this.chunks = [];
  }

  _destroy(ERR, callback) {
    console.log(`Number of writes: ${this.numberOfWrites}`);
    if (!this.fd) return callback(ERR);
    fs.close(this.fd, (err) => {
      if (err) {
        callback(ERR || err);
      } else {
        callback();
      }
    });
  }
}

module.exports = FileWriteStream;

// (async () => {
//   console.time("WriteMany");
//   const streams = new FileWriteStream({ fileName: "./text.txt" });

//   let i = 0;
//   const numberOfWrites = 1000000;

//   const streamsWrite = () => {
//     while (i <= numberOfWrites) {
//       i++;
//       if (i === numberOfWrites) {
//         streams.end();
//         return;
//       }
//       if (!streams.write(` ${i} `)) break;
//     }
//   };
//   streamsWrite();
//   streams.on("drain", () => {
//     streamsWrite();
//   });

//   streams.on("finish", () => {
//     console.timeEnd("WriteMany");
//   });
// })();
