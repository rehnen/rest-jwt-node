const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
  res.json({
    message: "welcome",
  });
});

app.post("/api/posts",verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "post created",
        authData
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    userName: "marcus",
    email: "marcus.rehn@hotmail.com",
  }

  jwt.sign({ user }, 'secretKey', { expiresIn: '30s' }, (err, token) => {
    res.json({
      token,
    })
  });
});

function verifyToken(req, res, next) {
  next();
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const token = bearerHeader.split(" ")[1];
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(8080, () => console.log("server started on 8080"))