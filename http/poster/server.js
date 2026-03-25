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

//---- Middleware for Index.html ----\\
server.beforeEach((req, res, next) => {
  const paths = ["/", "/login", "/profile", "/new-post"];
  if (paths.indexOf(req.url) !== -1 && req.method === "GET") {
    res.status(200).sendFile("./public/index.html", "text/html");
  } else {
    next();
  }
});

//---- Middleware for authorization ----\\
// The usage of this middleware is to check if the user has logged in when they want to access /api/user, /api/posts, etc. By checking the user's cookie
server.beforeEach((req, res, next) => {
  const routesToAuthenticate = [
    "GET /api/user",
    "PUT /api/user",
    "POST /api/posts",
    "DELETE /api/logout",
  ];

  if (routesToAuthenticate.indexOf(`${req.method} ${req.url}`) !== -1) {
    const cookie = req.headers.cookie;

    if (cookie) {
      const token = cookie.split("=")[1];
      const session = SESSIONS.find((session) => session.token === token);
      if (session) {
        req.userId = session.userId;
        return next();
      }
    }

    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
});

//---- Middleware for parsing small JSON ----\\
server.beforeEach((req, res, next) => {
  if (req.headers["content-type"] === "application/json") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedJSON = JSON.parse(body);
      req.body = parsedJSON;
      next();
    });
  } else {
    next();
  }
});

server.listen(9000, "localhost", () => {
  console.log("Server is running on: ", server.address());
});

//---- File Routes ----\\

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
  const username = req.body.username;
  const password = req.body.password;

  const token = String(Math.floor(Math.random() * 10000000000));

  const user = USERS.find(
    (user) => user.username === username && user.password === password,
  );
  if (user) {
    SESSIONS.push({ userId: user.id, token });
    res.setHeader("Set-Cookie", `token=${token}; Path=/; httpOnly; `);
    res.status(202).json({ message: "Logged in" });
  } else {
    res.status(401).json({ error: "Wrong username or password" });
  }
});

server.route("get", "/api/user", (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);
  res.status(200).json({ name: user.name, username: user.username });
});

server.route("put", "/api/user", (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  const user = USERS.find((user) => user.id === req.userId);

  if (user) {
    user.name = name;
    user.username = username;
    if (password) {
      user.password = password;
    }
    return res.status(200).json({ message: "Profile updated" });
  }

  res.status(404).json({ error: "User not found" });
});

server.route("post", "/api/posts", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;

  // Checking for the title and body on the JSON the client sent to make the server more robust
  if (!title || !body) {
    return res
      .status(400)
      .json({ message: "Bad request, no post title or body found" });
  }

  const newPost = {
    id: POSTS.length + 1,
    title,
    body,
    userId: req.userId,
  };

  POSTS.unshift(newPost);
  res.status(201).json({ message: "Post created" });
});

server.route("delete", "/api/logout", (req, res) => {
  const sessionIndex = SESSIONS.findIndex(
    (session) => session.userId === req.userId,
  );

  if (sessionIndex !== -1) {
    SESSIONS.splice(sessionIndex, 1);
    res.setHeader(
      "Set-Cookie",
      `token=deleted; Path=/; httpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT `,
    );
    res.status(200).json({ message: "Logged out" });
  } else {
    res.status(400).json({ message: "Already logged out" });
  }
});
