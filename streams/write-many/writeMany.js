// Promise way
// const fs = require("node:fs/promises");

// // Execution Time: 37s
// (async () => {
//     console.time("WriteMany");
//     const file = await fs.open("./test.txt", "w");
//     for (let i = 0; i < 1000000; i++) {
//         await file.write(`${i + 1}\n`);
//     }
//     file.close();
//     console.timeEnd("WriteMany");
// })();

// // Callback way
// const fs = require("node:fs");

// // Execution Time: 3.7s
// (async () => {
//     console.time("WriteMany");
//     fs.open("./test.txt", "w", (err, fd) => {
//         for (let i = 0; i < 1000000; i++) {
//             const buff = Buffer.from(`${i + 1}\n`, "utf-8");
//             fs.writeSync(fd, buff);
//         }
//         console.timeEnd("WriteMany");
//     });
// })();

// WRONG WAY TO DO STREAMS
// Stream
// const fs = require("node:fs/promises");

// // Execution Time: 300ms
// (async () => {
//     console.time("WriteMany");
//     const file = await fs.open("./test.txt", "w");

//     const streams = file.createWriteStream();

//     for (let i = 0; i < 1000000; i++) {
//         const buff = Buffer.from(`${i + 1}\n`, "utf-8");
//         streams.write(buff);
//     }
//     file.close();
//     console.timeEnd("WriteMany");
// })();

// Correct way
const fs = require("node:fs/promises");

// Execution Time: 300ms
(async () => {
    console.time("WriteMany");
    const file = await fs.open("./test.txt", "w");

    const streams = file.createWriteStream();

    // Reference code
    // const buff = Buffer.alloc(16384, "a");
    // console.log(streams.writableHighWaterMark);
    // console.log(streams.write(buff));
    // streams.on("drain", () => {
    //     console.log("We are safe to write more!!!");
    // });

    // With chunk: 110ms
    // let i = 0;
    // let chunk = [];

    // const streamsWrite = () => {
    //     while (i < 1000000) {
    //         i++;
    //         const buff = Buffer.from(`${i}\n`);
    //         chunk.push(buff);
    //         if (i === 1000000) {
    //             streams.end(Buffer.concat(chunk));
    //             return;
    //         }
    //         if (chunk.length === 16000) {
    //             streams.write(Buffer.concat(chunk));
    //             chunk = [];
    //         }
    //     }
    // };

    // Immediately writing to streams: 3-4s
    // Memory usage: 40MB
    let i = 0;

    const streamsWrite = () => {
        while (i < 10000000) {
            i++;
            if (i === 10000000 - 1) {
                streams.end();
                return;
            }
            if (!streams.write(` ${i} `)) break;
        }
    };
    streamsWrite();
    streams.on("drain", () => {
        streamsWrite();
    });

    streams.on("finish", () => {
        console.timeEnd("WriteMany");
        file.close();
    });
})();
