const { Buffer } = require("buffer");

// const myMemory = Buffer.alloc(4);

// myMemory[0] = 0x45;
// myMemory[1] = 0xb5;
// myMemory[2] = 0xff;
// myMemory[3] = 0xac;

// console.log(myMemory);
// console.log(myMemory[0]);
// console.log(myMemory[1]);
// console.log(myMemory[2]);
// console.log(myMemory[3]);

// const buff = Buffer.from([0x48, 0x69, 0x21]);
// console.log(buff.toString("utf-8"));

// const buff = Buffer.from("486921", "hex");
// console.log(buff.toString("utf-8"));

// const buff = Buffer.from("string", "utf-8");
// console.log(buff);

const buff = Buffer.from("E38191", "hex");
console.log(buff.toString("utf-8"));
