// 0100 1000 0110 1001 0010 0001

const { Buffer } = require("buffer");

const myMemory = Buffer.alloc(3); // 24 bits / 8 = 3 bytes

myMemory[0] = 0x48;
myMemory[1] = 0x69;
myMemory[2] = 0x21;

console.log(myMemory.toString("utf-8"));
console.log(myMemory[0]);
console.log(myMemory[1]);
console.log(myMemory[2]);
