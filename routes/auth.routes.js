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

router.post("/signup", signup);
router.post("/login", login);
router.post("/follow", auth, follow);
router.post("/unfollow", auth, unfollow);
router.get("/search", auth, search);
router.get("/randomuser", auth, randomuser);
router.post("/editInfo", auth, editInfo);
router.get("/getUser", auth, getUser);
router.post("/forgotPassword", auth, forgotPassword);
router.post("/verifyPassResetCode", verifyPassResetCode);
router.post("/resetPassword", resetPassword);

module.exports = router;
