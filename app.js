const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const articalsRouter = require("./routes/articles");
const categoryRouter = require("./routes/category");

const connectDB = require("./db/database");

const app = express();

connectDB();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/artical", articalsRouter);
app.use("/api/v1/category", categoryRouter);

module.exports = app;
