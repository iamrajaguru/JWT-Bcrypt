require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

let refreshTokens = []; //store refresh token in database
//Generation Token using refresh token
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

//Login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);//Add token to db
  res.json({ accessToken, refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}
//Logout
app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});
app.listen(3000, () => console.log("Started "));
