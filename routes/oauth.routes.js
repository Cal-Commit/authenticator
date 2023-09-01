const express = require("express");
const { body } = require("express-validator");

const { oauthController } = require("../controllers/oauth.controller");

const router = express.Router();

router.post("/oauth-github", oauthController.getGHAccessToken);

router.post("/oauth-gh-check", oauthController.existingUserCheckGH);

router.post("/authenticate-gh", oauthController.authenticateGH);

module.exports = router;
