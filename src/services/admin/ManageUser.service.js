const User = require("../../models/user/User.model");
const Role = require("../../models/user/Role.model")
const bcrypt = require("bcryptjs");
class ManageUserService {
    async getAllUser(){
        try{
            const userData = await User.find({}).populate("roleId", "code color");
            if(!userData) throw new Error("Không tìm thấy người dùng !");
            let responseData = [];
            userData.forEach((user) => {
                responseData.push({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullname: user.fullname,
                    phone: user.phone,
                    status: user.status,
                    role: user.roleId.code,
                    colorRole: user.roleId.color,
                    lastLogin: user.lastLogin,
                    loyaltyPoints: user.loyaltyPoints,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                })
            })
            return responseData;
        }catch (e) {
            throw new Error(e);
        }
    }

    async addNewUser(dataReq){
        try{
            const {username, email, fullname, phone, role, status} = dataReq;
            if(!username || !email || !fullname || !phone || !role || !status){
                throw new Error("Thông tin không hợp lệ !!!");
            }
            const user = await User.findOne({username: username});
            if(user){
                throw new Error("Tên đăng nhập đã tồn tại !!!");
            }
            const emailUser = await User.findOne({email: email});
            if(emailUser){
                throw new Error("Email đã tồn tại !!!");
            }
            const phoneUser = await User.findOne({phone: phone});
            if(phoneUser){
                throw new Error("Số điện thoại đã tồn tại !!!");
            }
            const password = "12345678";
            const hashPassword = await bcrypt.hash(password, 10);

            const findRole = await Role.findOne({code: role});
            if(!findRole){
                throw new Error("Mã quyền không tìm thấy !!!");
            }

            const newUser = new User({
                username,
                password: hashPassword,
                roleId: findRole._id,
                email,
                fullname,
                phone,
                status: status
            })

            await newUser.save();
            return newUser;
        }catch (e) {
            throw new Error(e);
        }
    }

    async updateUser(dataReq){
        try{
            const {id, fullname, role, status} = dataReq;
            if(!id || !fullname || !role || !status){
                throw new Error("Thong tin khong hop le !!!");
            }
            const resUser = await User.findById(id);
            if(!resUser){
                throw new Error("Không tìm thấy người dùng !");
            }

            const findRole = await Role.findOne({code: role});
            if(!findRole){
                throw new Error("Mã quyền không tìm thấy !!!");
            }

            resUser.fullnam = fullname;
            resUser.roleId = findRole._id;
            resUser.status = status;

            await resUser.save();
            return resUser;
        }catch (e) {
            throw new Error(e);
        }
    }

    async deleteUser(id){
        try{
            const dataUser = await User.findById(id);
            if(!dataUser){
                throw new Error("Không tìm thấy người dùng !")
            }
            dataUser.status = "00";
            await dataUser.save();
            return dataUser;
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new ManageUserService();