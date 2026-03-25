const fs = require("fs");
const crypto = require("crypto");
const { pipeline } = require("stream");

/**
 * Encrypted data:
 * First 16 bytes: Salt
 * Second 16 bytes: IV
 * Last 16 bytes: Message Authentication Code
 */

const fd = fs.openSync("./data.enc");
const fileSize = fs.fstatSync(fd).size;

const password = "myMom12345";

const salt = Buffer.alloc(16);
const iv = Buffer.alloc(12);
const mac = Buffer.alloc(16);
const algorithm = "aes-256-gcm";

fs.readSync(fd, salt, 0, 16, 0);
fs.readSync(fd, iv, 0, 12, 16);
fs.readSync(fd, mac, 0, 16, fileSize - 16);

console.log(
  `Salt is: ${salt.toString("hex")} \nIV is: ${iv.toString("hex")} \nMAC is: ${mac.toString("hex")}`,
);

crypto.pbkdf2(password, salt, 1_000_000, 32, "sha512", (err, key) => {
  if (err) return console.error(err);

  const cipher = crypto.createDecipheriv(algorithm, key, iv);
  cipher.setAuthTag(mac);

  const encryptedData = fs.createReadStream("./data.enc", {
    start: 28,
    end: fileSize - (16 + 1),
  });
  const output = fs.createWriteStream("./data-decrypted.txt");

  pipeline(encryptedData, cipher, output, (err) => {
    if (err) return console.error(err);

    console.log("Data decrypted");
  });
});
