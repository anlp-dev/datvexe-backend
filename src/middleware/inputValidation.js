const User = require("../models/user/User");
const bcrypt = require("bcryptjs");
const STATUS_ACCOUNT = require("../enums/statusAccount");
const inputValidationAccount = async (req, res, next) => {
  try {
    const { username, email, phone } = req.body;

    if (!username || !email || !phone) {
      return res.status(400).json({ status: 400, message: "Thiếu thông tin đăng ký" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    const errors = [];
    if (existingUser) {
      if (existingUser.username === username) errors.push("Username đã tồn tại");
      if (existingUser.email === email) errors.push("Email đã tồn tại");
      if (existingUser.phone === phone) errors.push("Số điện thoại đã tồn tại");
    }

    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: errors });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const inputValidationLogin = async (req, res, next) => {
  try{
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 400, message: "Thiếu tài khoản hoặc mật khẩu" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ status: 401, message: "Tài khoản không tồn tại" });
    }
    if (!user) {
      throw new Error("Tài khoản không tồn tại, vui lòng đăng kí tài khoản mới.")
    }

    if (user.status === STATUS_ACCOUNT.INACTIVE) {
      throw new Error("Tài khoản chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt.")
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 401, message: "Mật khẩu không chính xác" });
    }
    next();
  }catch (e) {
    res.status(500).json({ message: "Lỗi server: " + e.message });
  }
}

module.exports = { inputValidationAccount, inputValidationLogin };
