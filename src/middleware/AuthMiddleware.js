const jwt = require("jsonwebtoken");
const secret = require("../configs/Secrets");
const User = require("../models/user/User");
const {getPermissionsForUser} = require('../database/db');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, secret.JWT_SECRET_KEY);
    if (!decoded || !decoded.exp) {
      return res.status(401).json({
        status: 401,
        message: "Đã hết phiên đăng nhập vui lòng đăng nhập lại !",
      });
    }

    const currentTime = Math.floor(Date.now() /1000);
    if (decoded.exp < currentTime) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Token has expired",
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Người dùng không tồn tại !",
      });
    }

    if(user.status === "00"){
      return res.status(401).json({
        status: 401,
        message: "Tài khoản đã bị khóa hoặc vô hiệu hóa !",
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
