const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    email: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, defaul: "" },
    status: { type: String, default: "00" },
    avatar: { type: String, default: "" }, // Ảnh đại diện
    dateOfBirth: { type: Date, default: null }, // Ngày sinh
    gender: { type: String, enum: ["male", "female", "other"], default: "other" }, // Giới tính
    verified: { type: Boolean, default: false }, // Xác minh tài khoản
    lastLogin: { type: Date, default: null }, // Lần đăng nhập gần nhất
    loyaltyPoints: { type: Number, default: 0 }, // Điểm tích lũy
    referralCode: { type: String, default: null }, // Mã giới thiệu
    isBlocked: { type: Boolean, default: false }, // Trạng thái khóa tài khoản
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    deleteAt: { type: Date, default: null },
}, { collection: 'User' });

module.exports = mongoose.model('User', User);
