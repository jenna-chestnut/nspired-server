/* eslint-disable no-unused-vars */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const winWallRouter = require('./Routes/win-wall-router');
const authRouter = require("./middleware/auth-router");
const goalsRouter = require("./Routes/goals-router");
const upvotesRouter = require("./Routes/upvotes-router");
const adviceRouter = require("./Routes/advice-router");
const registerRouter = require("./Routes/registration-router");
const inspoRouter = require("./Routes/inspo-router");

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

const app = express();
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/auth", registerRouter);
app.use("/api/win-wall", winWallRouter);
app.use("/api/inspo", inspoRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/upvotes", upvotesRouter);
app.use("/api/advice", adviceRouter);

app.get('/', (req, res) => {
  res.send('Hello, nSpired!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
