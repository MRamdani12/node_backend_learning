const crypto = require("crypto");
const fs = require("node:fs");

const secretMessage = Buffer.from(
  "This is my password: 12121212, and this is my bank cvc number: 441",
  "utf-8",
);

const publicKeyPem = fs.readFileSync("../public-key.pem");

const encryptedData = crypto.publicEncrypt(publicKeyPem, secretMessage);

fs.writeFileSync("./file.enc", encryptedData);
