import * as http from "node:http";

const agent = new http.Agent({ keepAlive: true });

const requestBody = Buffer.from(
  JSON.stringify({
    title: "How to massage your body",
    body: "Checkout how to massage your own body free!",
  }),
  "utf-8",
);

const options = {
  agent,
  hostname: "127.0.0.1",
  port: 8000,
  path: "/upload",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-length": requestBody.byteLength,
  },
};

const request = http.request(options, (res) => {
  console.log("-------- STATUS: --------");
  console.log(res.statusCode);

  console.log("-------- HEADERS: --------");
  console.log(res.headers);

  res.on("data", (chunk) => {
    console.log(chunk.toString("utf-8"));
  });
});

request.on("error", (err) => {
  console.error(`Problem with request: ${err}`);
});

request.on("");

request.write(requestBody);
request.end();
