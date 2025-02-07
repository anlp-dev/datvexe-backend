const User = require("../../models/user/User");
const { v4: uuidv4 } = require("uuid");
const secret = require("../../configs/secrets");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const STATUS_ACCOUNT = require('../../enums/statusAccount');
const ROLE = require('../../enums/role');
class authService {
    async createUser(data){
        try{
            const {username, password, email, fullname, phone} = data;

            const hashPassword = await bcrypt.hash(password, 10);
            const roleId = ROLE.GUEST;
            const newUserData = new User({
                username,
                password: hashPassword,
                roleId: roleId,
                email,
                fullname,
                phone
            })

            await newUserData.save();
            return newUserData;
        }catch (e) {
            throw new Error(e);
        }
    }

    async login(data) {
        try {
            const { username, password } = data;
            // Tìm user theo username
            const user = await User.findOne({ username });

            // Tạo token
            const token = this.generateToken(user._id);
            if (!token) {
                throw new Error("Lỗi khi tạo token!");
            }

            return token;
        } catch (e) {
            throw new Error(e.message);
        }
    }


    generateToken(userId) {
        const token = jwt.sign({ userId }, secret.JWT_SECRET_KEY);
        return token;
    }
}

module.exports = new authService();