const fs = require("node:fs/promises");

(async () => {
    const fileRead = await fs.open("./src.txt", "r");
    const fileWrite = await fs.open("./dest.txt", "w");

    const streamRead = fileRead.createReadStream();
    const streamWrite = fileWrite.createWriteStream();

    let split = "";

    streamRead.on("data", (chunk) => {
        const chunkArr = chunk.toString("utf-8").split("  ");
        if (Number(chunkArr[1]) - 1 !== Number(chunkArr[0])) {
            chunkArr[0] = split.trim() + chunkArr[0].trim();
        }
        if (
            Number(chunkArr[chunkArr.length - 2]) + 1 !==
            Number(chunkArr[chunkArr.length - 1])
        ) {
            split = chunkArr.pop();
        }

        console.log(chunkArr);
        chunkArr.forEach((i) => {
            if (Number(i) % 2 === 0)
                if (!streamWrite.write(` ${i} `)) {
                    streamRead.pause();
                }
        });
    });

    streamWrite.on("drain", () => {
        streamRead.resume();
    });
})();
