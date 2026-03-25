const Butler = require("./butler");

// Making HTTP stateful and remember users via cookie
// format: {userId: number, token: someRandomGibberish}
const SESSIONS = [];

const USERS = [
  {
    id: 1,
    name: "Arthur Morgan",
    username: "arthur.morgan",
    password: "string",
  },
  { id: 2, name: "Hideyoshi", username: "hide.yoshi", password: "string" },
  {
    id: 3,
    name: "Nozomi Toujou",
    username: "nozomi.toujou",
    password: "string",
  },
];

const POSTS = [
  {
    id: 1,
    title: "How to make a cake",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    userId: 3,
  },
];

const server = new Butler();

server.listen(9001, "localhost", () => {
  console.log("Server is running on: ", server.address());
});

//---- File Routes ----\\
server.route("get", "/", (req, res) => {
  console.log("This is coming from the first server!");
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/login", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

//---- API Routes ----\\
server.route("get", "/api/posts", (req, res) => {
  const newPosts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    return { ...post, author: user.name };
  });
  res.status(200).json(newPosts);
});

server.route("post", "/api/login", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const parsedJSON = JSON.parse(body);
    const username = parsedJSON.username;
    const password = parsedJSON.password;

    const token = String(Math.floor(Math.random() * 10000000000));

    const user = USERS.find(
      (user) => user.username === username && user.password === password,
    );
    if (user) {
      SESSIONS.push({ userId: user.id, token });
      res.setHeader("Set-Cookie", `token=${token}; Path=/; httpOnly; `);
      res.status(200).json({ message: "Logged in" });
    } else {
      res.status(401).json({ error: "Wrong username or password" });
    }
  });
});

server.route("get", "/api/user", (req, res) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = cookie.split("=")[1];
  const session = SESSIONS.find((session) => session.token === token);
  console.log(SESSIONS, token, cookie);
  if (session) {
    const user = USERS.find((user) => user.id === session.userId);

    res.status(200).json({ name: user.name, username: user.username });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});
