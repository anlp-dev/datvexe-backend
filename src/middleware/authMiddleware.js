const jwt = require("jsonwebtoken");
const secret = require("../configs/secrets");
const {getPermissionsForUser} = require('../database/db');

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, secret.JWT_SECRET_KEY);
    if (!decoded) {
      return res.json({
        status: 401,
      });
    }

    req.account = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: error.message,
    });
  }
};

module.exports = auth;
