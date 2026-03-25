const net = require("net");
const fs = require("node:fs/promises");
const path = require("path");

const socket = net.createConnection({ host: "::1", port: 5000 }, async () => {
  console.log("Connected to uploader server");
  const filePath = process.argv.slice(2).join(" ");
  const fileName = path.basename(filePath);
  const fileHandle = await fs.open(`${filePath}`, "r");
  const fileReadStream = fileHandle.createReadStream();
  const fileSize = (await fileHandle.stat()).size;
  let bytesRead = 0;

  socket.write(`filename---${fileName}----`);

  fileReadStream.on("data", (data) => {
    const percent = Math.round((bytesRead / fileSize) * 100);
    if (!socket.write(data)) {
      fileReadStream.pause();
    }

    process.stdout.write(`\rUploading file... ${percent}%`);

    bytesRead += data.length;
  });

  socket.on("drain", () => {
    fileReadStream.resume();
  });

  fileReadStream.on("end", () => {
    fileHandle.close();
    socket.end();
    console.log("\nFile has been uploaded to the server");
  });
});
