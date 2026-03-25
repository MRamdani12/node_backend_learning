const net = require("net");
const fs = require("node:fs/promises");

const server = net.createServer((socket) => {
  console.log("A client just connected to the server");
  let fileHandle, fileWriteStream;

  socket.on("data", async (data) => {
    if (!fileHandle) {
      socket.pause(); // Pause the socket stream so it doesn't receive anymore data at the moment.
      const indexOfFirstDivider = data.indexOf("---");
      const indexOfLastDivider = data.indexOf("----");
      const fileName = data
        .toString("utf-8")
        .slice(indexOfFirstDivider + 3, indexOfLastDivider);

      console.log(fileName);
      fileHandle = await fs.open(`storage/${fileName}`, "w");
      fileWriteStream = fileHandle.createWriteStream();

      fileWriteStream.write(data.subarray(indexOfLastDivider + 4));
      socket.resume(); // Resume the socket stream after the file has opened or created
      fileWriteStream.on("drain", () => {
        socket.resume();
      });
    } else {
      if (!fileWriteStream.write(data)) {
        socket.pause();
      }
    }
  });

  socket.on("error", () => {
    if (fileHandle) fileHandle.close();
    fileHandle = undefined;
    fileWriteStream = undefined;
    console.log("A client just ended their connection");
  });

  socket.on("end", () => {
    if (fileHandle) fileHandle.close();
    fileHandle = undefined;
    fileWriteStream = undefined;
    console.log("A client just ended their connection");
  });
});

server.listen(5000, "::1", () => {
  console.log("Uploader server is running on port:", server.address());
});
