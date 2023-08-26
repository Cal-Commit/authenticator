const User = require("../models/user.model");

const pwdHelper = require("../helpers/pwd.helper");
const jwtHelper = require("../helpers/jwt.helper");

const { validationResult } = require("express-validator");

exports.authController = {
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0] });
    }

    const { fullName, email, password } = req.body;

    const pwdHash = await pwdHelper.hashPassword(password);

    User.find({ email }).then(async (users) => {
      if (users.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const newUser = new User({
        fullName,
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
      });
    });
  },
};
