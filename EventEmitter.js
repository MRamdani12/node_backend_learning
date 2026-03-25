const EventEmitter = require("events");

class events extends EventEmitter {}

const myE = new events();

myE.once("foo", () => {
    console.log("Foo event is running");
});
myE.on("foo", () => {
    console.log("Foo event is running");
});
myE.on("foo", (x) => {
    console.log(`Foo event with parameter is running: ${x}`);
});

myE.emit("foo", "Test");
myE.emit("foo", "Test");
myE.emit("foo", "Test");
