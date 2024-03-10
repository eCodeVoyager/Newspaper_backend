const express = require("express");
const router = express.Router();
const {
  createArticle,
  getAllarticles,
  getArticle,
  updateArticle,
  deleteArticle,
  getarticlesByCategory,
} = require("../controllers/articleController.js.js");
const isUserLoggedin = require("../middlewares/isUserLoggedin.js");

router.post("/create-articlA", isUserLoggedin, createArticle);
router.get("/", getAllarticles);
router.get("/:id", getArticle);
router.put("/:id", isUserLoggedin, updateArticle);
router.delete("/:id", isUserLoggedin, deleteArticle);
router.get("/category/:name", getarticlesByCategory);

module.exports = router;
