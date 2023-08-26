const jwt = require("jsonwebtoken");

const token = (email) => {
  const payload = {
    data: email,
  };
  return new Promise((reject, resolve) => {
    const now = new Date();
    const dateOfExpiry = new Date(new Date().setHours(23, 59, 59, 999));
    const hoursToExpiry = Math.floor((dateOfExpiry - now) / 1000 / 60 / 60 + 1);
    jwt.sign(
      payload,
      String(process.env.TOKEN_SECRET),
      {
        expiresIn: `${hoursToExpiry}h`,
      },
      function (err, tokenVal) {
        if (err) resolve(err);
        else reject(tokenVal);
      }
    );
  });
};

exports.generateAccessToken = async (email) => {
  return await token(email);
};
