const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const pool = require("../../config/db.config"); // Import PostgreSQL pool

exports.signupValidator = [
  check("username")
    .custom((username, { req }) => (req.body.slug = slugify(username)))
    .notEmpty()
    .withMessage("User Required")
    .isLength({ min: 3 })
    .withMessage("Too short user name"),

  check("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Invalid email address")
    .toLowerCase()
    .custom(async (val) => {
      const result = await pool.query("SELECT email FROM users WHERE email = $1", [val]);
      if (result.rows.length > 0) {
        throw new Error("E-mail already exists");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("Password Required")
    .isLength({ min: 6 })
    .withMessage("Too short password"),

  validatorMiddleware,
];
