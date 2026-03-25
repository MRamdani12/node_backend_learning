const fs = require("node:fs/promises");

(async () => {
    const COMMAND_FILENAME = "command.txt";
    const CREATE_FILE = "create a file";
    const DELETE_FILE = "delete a file";
    const RENAME_FILE = "rename the file";
    const ADD_TO_FILE = "add to the file";
    const commandFile = await fs.open("./command.txt", "r");

    const createFile = async (path) => {
        try {
            const existingFile = await fs.open(path, "wx");
            existingFile.close();
            return console.log(`File created`);
        } catch (e) {
            if (e.code === "ENOENT") {
                console.log(`No such file in path "${path}" to delete`);
            } else {
                console.log(`An error occured when creating file: ${e}`);
            }
        }
    };

    const deleteFile = async (path) => {
        try {
            await fs.unlink(path);
            return console.log(`File was deleted`);
        } catch (e) {
            if (e.code === "ENOENT") {
                console.log(`No such file in path "${path}" to delete`);
            } else {
                console.log(`An error occured when deleting file: ${e}`);
            }
        }
    };

    const renameFile = async (oldPath, newPath) => {
        try {
            await fs.rename(oldPath, newPath);
            return console.log(`File was renamed`);
        } catch (e) {
            if (e.code === "ENOENT") {
                console.log(
                    `No such file in path "${path}" to rename or destination doesn't exist`,
                );
            } else {
                console.log(`An error occured when renaming file: ${e}`);
            }
        }
    };

    let addedContent;
    const addToTheFile = async (path, data) => {
        try {
            if (addedContent === data) throw new Error("Data is already added");
            addedContent = data;
            await fs.appendFile(path, data);
            return console.log(`Data "${data}" was added to the file: ${path}`);
        } catch (e) {
            if (e.code === "ENOENT") {
                console.log(`No such file in path "${path}" to write into`);
            } else {
                console.log(`An error occured when adding to the file: ${e}`);
            }
            addedContent = "";
        }
    };

    commandFile.on("change", async () => {
        // Get the size/byte of the file
        const size = (await fs.stat(`./${COMMAND_FILENAME}`)).size;
        // Allocating buffer with the size
        const buff = Buffer.alloc(size);
        // The location at which the buffer will start to get filled
        const offset = 0;
        // How many bytes we want to read
        const length = buff.byteLength;
        // The position that we want to start reading the file from
        const position = 0;

        await commandFile.read(buff, offset, length, position);

        const command = buff.toString("utf-8");

        // create a file
        // command: create a file <path>
        if (command.includes(CREATE_FILE)) {
            const path = command.substring(CREATE_FILE.length + 1);
            createFile(path);
        }

        // delete a file
        // command: delete a file
        if (command.includes(DELETE_FILE)) {
            const path = command.substring(DELETE_FILE.length + 1);
            deleteFile(path);
        }

        // rename the file
        // command: rename the file
        if (command.includes(RENAME_FILE)) {
            const path = command.substring(RENAME_FILE.length + 1);
            const paths = path.split(" ");
            // const string = 'text.txt tes.txt'
            // console.log(paths);
            renameFile(paths[0], paths[1]);
        }

        // add to the file
        // command: add to the file
        if (command.includes(ADD_TO_FILE)) {
            const path = command.substring(ADD_TO_FILE.length + 1);
            const paths = path.split(" ");
            const data = paths.slice(1).join(" ");

            addToTheFile(paths[0], data);
        }
    });

    // Watching the file for the eventType of "change"
    const watcher = fs.watch("./command.txt");
    for await (const event of watcher) {
        if (event.eventType === "change") {
            commandFile.emit("change");
        }
    }
})();
