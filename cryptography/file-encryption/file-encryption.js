const fs = require("fs");
const crypto = require("crypto");
const { pipeline } = require("stream");

/**
 * Final encrypted data:
 * First 16 bytes: Salt
 * Second 12 bytes: IV
 * Last 16 bytes: Message Authentication Code
 */

const password = "myMom12345";

const algorithm = "aes-256-gcm";
const iv = crypto.randomBytes(12); // 12 bytes according to NIST specification reccomendation
const salt = crypto.randomBytes(16); // At least 16 bytes also according to NIST specification

crypto.pbkdf2(password, salt, 1_000_000, 32, "sha512", (err, key) => {
  if (err) return console.error(err);
  const data = fs.createReadStream("./data.txt");
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const output = fs.createWriteStream("./data.enc");

  // Prepending the iv and salt into the encrypted data
  output.write(salt);
  output.write(iv);

  console.log(
    `Salt is: ${salt.toString("hex")} \nIV is: ${iv.toString("hex")}`,
  );

  pipeline(data, cipher, output, (err) => {
    if (err) return console.error(err);

    const authTag = cipher.getAuthTag();

    // Appending the MAC last
    fs.appendFileSync("./data.enc", authTag); // 16 bytes
    console.log(`MAC is: ${authTag.toString("hex")}`);
    console.log("Encryption completed");
  });
});
