const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const { authController } = require("../controllers/auth.controller");

router.post(
  "/register",
  [
    body("fullName")
      .notEmpty()
      .withMessage("required")
      .isLength({ min: 3 })
      .withMessage("minLength")
      .trim(),
    body("email")
      .notEmpty()
      .withMessage("required")
      .isEmail()
      .withMessage("pattern")
      .trim()
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("required")
      .isLength({ min: 8 })
      .withMessage("minLength")
      .isLength({ max: 12 })
      .withMessage("maxLength")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "i"
      )
      .withMessage("pattern")
      .trim(),
    body("confirmPassword")
      .notEmpty()
      .withMessage("required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("nomatch");
        }
        return true;
      }),
    body("termsOfUse").notEmpty().withMessage("required"),
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("emalreq")
      .isEmail()
      .withMessage("emailinv")
      .trim()
      .normalizeEmail(),
    body("password").notEmpty().withMessage("passreq").trim(),
  ],
  authController.login
);

module.exports = router;
