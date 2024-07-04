const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const blogRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

require("./mongoose_db");

const tokenMiddleware = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
    next();
  } else {
    // else required to avoid Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    next();
  }
};

const userCheckMiddleware = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  } else {
    request.userId = decodedToken.id;
    next();
  }
};

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use(tokenMiddleware);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/blogs", userCheckMiddleware, blogRouter);
if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "ValidationError") {
    return res.status(400).send({ message: err.message });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  } else if (
    err.name === "MongoServerError" &&
    err.message.includes("E11000 duplicate key error")
  ) {
    return res.status(400).json({ error: "expected `username` to be unique" });
  } else {
    res.status(500).send("Something broke!");
  }
});

module.exports = app;
