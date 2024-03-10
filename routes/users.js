const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const isUserLoggedin = require("../middlewares/isUserLoggedin");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loggedin-user", isUserLoggedin, (req, res) => {
  res.json(req.user);
});
router.get("/logout", isUserLoggedin, logoutUser);

router.delete("/delete-user", isUserLoggedin, deleteUser);
router.put("/update-user", isUserLoggedin, updateUser);


module.exports = router;
