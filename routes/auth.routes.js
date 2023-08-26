const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const { authController } = require("../controllers/auth.controller");

router.post(
  "/register",
  [
    body("fullName")
      .notEmpty()
      .withMessage("fnamereq")
      .isLength({ min: 3 })
      .withMessage("fnamelength")
      .trim(),
    body("email")
      .notEmpty()
      .withMessage("emalreq")
      .isEmail()
      .withMessage("emailinv")
      .trim()
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("passreq")
      .isLength({ min: 8 })
      .withMessage("passinv")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "i"
      )
      .withMessage("passinv")
      .trim(),
    body("confirmPassword")
      .notEmpty()
      .withMessage("required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("passnomatch");
        }
        return true;
      }),
  ],
  authController.register
);

module.exports = router;
