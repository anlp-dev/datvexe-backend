const User = require("../../models/user/User");
const { v4: uuidv4 } = require("uuid");
const secret = require("../../configs/Secrets");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const STATUS_ACCOUNT = require('../../enums/statusAccount');
const ROLE = require('../../enums/role');
const Role = require('../../models/user/Role');
class authService {
    async createUser(data){
        try{
            const {username, password, email, fullname, phone} = data;
            const roleList = await Role.find({});
            // lay role guest
            const guestRole = roleList.find(role => role.code === ROLE.GUEST);
            const hashPassword = await bcrypt.hash(password, 10);
            const roleId = guestRole?._id;
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

    async getUserByID(userReq){
        try{
            const user = await User.findById(userReq).populate('roleId', 'code name');
            if(!user){
                throw new Error("Không tìm thấy người dùng!");
            }
            else{
                return user;
            }
        }catch (e) {
            throw new Error(e);
        }
    }


    generateToken(userId) {
        const token = jwt.sign({ userId }, secret.JWT_SECRET_KEY, { expiresIn: '30m' });
        return token;
    }
}

module.exports = new authService();