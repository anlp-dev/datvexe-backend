const User = require("../models/user/User");
const bcrypt = require("bcryptjs");
const STATUS_ACCOUNT = require("../enums/statusAccount");
const inputValidationAccount = async (req, res, next) => {
  try {
    const {username, password, email, fullname, phone} = req.body;

    if (!username || !email || !phone) {
      return res.status(400).json({ status: 400, message: "Thiếu thông tin đăng ký" });
    }

    const isValidUsername = await User.findOne({ username: username });
    if(isValidUsername){
      throw new Error("Tài khoản đã tốn tại.");
    }

    const isValidEmail = await User.findOne({ email: email });
    if(isValidEmail){
      throw new Error("Email đã tốn tại.");
    }

    const isValidPhone = await User.findOne({ phone: phone });
    if(isValidPhone){
      throw new Error("Số điện thoại đã tốn tại.");
    }


    if (password.length < 8) {
      throw new Error("Mật khẩu phải ít nhất 8 kí tự.");
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error("Mật khẩu phải bao góp 1 ký tự với 1 số.");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error("Số điện thoại không hợp lệ.");
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
