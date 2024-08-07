const {
  signup,
  login,
  follow,
  unfollow,
  search,
  randomuser,
  editInfo,
  getUser,
} = require("../controllers/authController.controllers");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const { auth } = require("../middlewares/auth");

const router = require("express").Router();
// Route to signup
router.post("/signup", signupValidator, signup);

// Route to login
router.post("/login", loginValidator, login);

//Route to follow
router.post("/follow", auth, follow);

//Route to unfollow
router.post("/unfollow", auth, unfollow);

//Route to search
router.post("/search", auth, search);

//Route to randomuser
router.get("/randomuser", auth, randomuser);

//Route to editInfo
router.post("/editInfo", auth, editInfo);

//Route to getUser
router.get("/getUser", auth, getUser);

module.exports = router;
