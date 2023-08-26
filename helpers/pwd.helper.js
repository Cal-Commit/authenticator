const bcrypt = require("bcrypt");

exports.hashPassword = async (pwd) => {
  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(pwd, salt);
};

exports.checkPassword = async (correctPwd, pwd) => {
  return bcrypt.compare(pwd, correctPwd);
};
