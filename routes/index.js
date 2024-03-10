var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (_, res) => {
  res.json({
    message: "Welcome to the Newspaper Backend API !",
    serverStatus: "Running",
  });
});

module.exports = router;
