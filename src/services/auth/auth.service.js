const User = require("../../models/user/User.model");
const { v4: uuidv4 } = require("uuid");
const secret = require("../../configs/Secrets");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const STATUS_ACCOUNT = require("../../enums/statusAccount");
const ROLE = require("../../enums/role");
const Role = require("../../models/user/Role.model");
const emailService = require("./Email.service");

class authService {
  async createUser(data) {
    try {
      const { username, password, email, fullname, phone } = data;
      const roleList = await Role.find({});
      // lay role guest
      const guestRole = roleList.find((role) => role.code === ROLE.GUEST);
      const hashPassword = await bcrypt.hash(password, 10);
      const roleId = guestRole?._id;
      const newUserData = new User({
        username,
        password: hashPassword,
        roleId: roleId,
        email,
        fullname,
        phone,
      });
      await newUserData.save();

      const emailSent = await emailService.sendEmailActiveUser({
        to: email,
        subject: "[no-reply]Xác nhận tài khoản của bạn",
        text: `https://api.datvexe-manage.id.vn/auth/email/verify/${newUserData._id}`,
      });
      return newUserData;
    } catch (e) {
      throw new Error(e);
    }
  }

  async login(data) {
    try {
      const { username, password } = data;
      // Tìm user theo username
      const user = await User.findOne({ username }).populate("roleId", "code");
      const token = this.generateToken(user._id, user.roleId.code, user.fullname);
      if (!token) {
        throw new Error("Lỗi khi tạo token!");
      }
      await this.updateLastLogin(user._id);
      return token;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getUserByID(userReq) {
    try {
      const user = await User.findById(userReq).populate("roleId", "code name");
      if (!user) {
        throw new Error("Không tìm thấy người dùng!");
      } else {
        return user;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateLastLogin(id){
    try{
      const dataUser = await User.findByIdAndUpdate(id, {lastLogin: Date.now()});
      if (!dataUser) {
        throw new Error("User not found");
      }
    }catch (e) {
      throw new Error(e);
    }
  }

  generateToken(userId, role, fullname) {
    const token = jwt.sign({ userId, role, fullname }, secret.JWT_SECRET_KEY, {
      expiresIn: "30m",
    });
    return token;
  }

  async updateStatusUser(id){
    try{
      const dataUser = await User.findById(id);
        if(!dataUser){
            throw new Error("Không tìm thấy người dùng !");
        }
        if(dataUser.status === STATUS_ACCOUNT.ACTIVE){
            throw new Error("Tài khoản đã được kích hoạt !");
        }
        dataUser.status = STATUS_ACCOUNT.ACTIVE;
        await dataUser.save();
        return dataUser;
    }catch (e) {
      throw new Error(e);
    }
  }

  async updateProfileUserById(id, data){
    try{
      const {fullname, email, phone, address, dateOfBirth} = data;
      if(!fullname || !email || !phone || !address || !dateOfBirth){
        throw new Error("Thieu thong tin");
      }
      const dataUser = await User.findById(id);
      if(!dataUser){
        throw new Error("Không tìm thấy người dùng !");
      }
      dataUser.fullname = fullname;
      dataUser.email = email;
      dataUser.phone = phone;
      dataUser.address = address;
      dataUser.dateOfBirth = dateOfBirth;
      await dataUser.save();
      return dataUser;
    }catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new authService();
