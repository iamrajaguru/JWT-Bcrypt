require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
const posts = [
  {
    username: "Guru",
    title: "Post 1",
  },
  {
    username: "Raja",
    title: "Post 2",
  },
  {
    username: "Raghu",
    title: "Post 3",
  },
  {
    username: "Ram",
    title: "Post 4",
  },
];
const users = [];
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);
    req.user = user;
    next();
  });
}
app.get("/posts", authenticateToken, async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(salt);
    console.log(hashedPassword);

    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.json(posts.filter((post) => post.username === req.user.name));
  } catch (err) {
    res.sendStatus(500);
  }
});

app.listen(3200, () => console.log("Started "));
