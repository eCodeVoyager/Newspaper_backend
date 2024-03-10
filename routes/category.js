const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const isUserLoggedin = require("../middlewares/isUserLoggedin");

router.post("/create-category", isUserLoggedin, createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategory);
router.put("/:id", isUserLoggedin, updateCategory);
router.delete("/:id", isUserLoggedin, deleteCategory);

module.exports = router;
