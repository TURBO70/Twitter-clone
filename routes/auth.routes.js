const {
  signup,
  login,
  follow,
  unfollow,
  search,
  randomuser,
  editInfo,
  getUser,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../controllers/authController.controllers");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const { auth } = require("../middlewares/auth");

const router = require("express").Router();
// Route to signup
router.post("/signup", signup); //

// Route to login
router.post("/login", login); //

//Route to follow
router.post("/follow", auth, follow); //

//Route to unfollow
router.post("/unfollow", auth, unfollow); //

//Route to search
router.get("/search", auth, search);

//Route to randomuser
router.get("/randomuser", auth, randomuser);

//Route to editInfo
router.post("/editInfo", auth, editInfo);

//Route to getUser
router.get("/getUser", auth, getUser); //

//Route to forgotPassword
router.post("/forgotPassword",auth, forgotPassword);

//Route to verifyPassResetCode
router.post("/verifyPassResetCode", verifyPassResetCode);

//Route to resetPassword
router.post("/resetPassword", resetPassword);

module.exports = router;
