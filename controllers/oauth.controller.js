const User = require("../models/user.model");

const pwdHelper = require("../helpers/pwd.helper");
const jwtHelper = require("../helpers/jwt.helper");

require("dotenv").config();

exports.oauthController = {
  getGHAccessToken: async (req, res) => {
    const { code } = req.body;

    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GH_CLIENT_ID,
          client_secret: process.env.GH_CLIENT_SECRET,
          code,
          redirect_uri: process.env.GH_REDIRECT_URI,
        }),
      }
    );

    const data = await response.text();

    const access_token = data.split("&")[0].split("=")[1];

    return res.status(200).json({ access_token });
  },
  existingUserCheckGH: async (req, res) => {
    const { email } = req.body;

    const existingUser = await User.find({ email });

    if (existingUser.length > 0) {
      return res.status(200).json({ userExists: true });
    }

    return res.status(200).json({ userExists: false });
  },
  authenticate: async (req, res) => {
    const { email } = req.body;

    const users = await User.find({ email });

    const pwdHash = await pwdHelper.hashPassword(
      require("crypto").randomBytes(64).toString("hex")
    );

    if (users.length !== 0) {
      const user = users[0];

      const token = await jwtHelper.generateAccessToken(user.email);

      return res.status(200).json({
        token,
        fullName: user.fullName,
        email: user.email,
        reputationPoints: user.reputationPoints,
        role: user.role,
        created_at: user.created_at,
      });
    }

    const newUser = new User({
      fullName: req.body.fullName,
      email,
      password: pwdHash,
      reputationPoints: 0,
      role: "user",
      created_at: new Date(),
    });

    const user = await newUser.save();

    const token = await jwtHelper.generateAccessToken(user.email);

    return res.status(200).json({
      token,
      fullName: user.fullName,
      email: user.email,
      reputationPoints: user.reputationPoints,
      role: user.role,
      created_at: user.created_at,
    });
  },
};
