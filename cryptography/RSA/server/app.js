const crypto = require("crypto");
const fs = require("node:fs");

// const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
//   modulusLength: 1024,
//   privateKeyEncoding: {
//     type: "pkcs8",
//     format: "pem",
//   },
//   publicKeyEncoding: {
//     type: "spki",
//     format: "pem",
//   },
// });

// fs.writeFileSync("./private-key.pem", privateKey);
// fs.writeFileSync("./public-key.pem", publicKey);

const privateKeyPem = fs.readFileSync("./server/private-key.pem");

const privateKey = crypto.createPrivateKey(privateKeyPem);

const encryptedData = fs.readFileSync("./server/file.enc");

const originalData = crypto.privateDecrypt(privateKey, encryptedData);

console.log(originalData.toString("utf-8"));
