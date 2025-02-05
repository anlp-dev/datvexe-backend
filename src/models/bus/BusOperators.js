const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusOperatorsSchema = new Schema({
    name: { type: String, required: true, unique: true }, // Tên nhà xe
    types: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeBus', required: true }, // Loại xe
    code: { type: String, required: true, unique: true }, // Mã nhà xe
    phone: { type: String, required: true }, // Số điện thoại
    email: { type: String, required: true, unique: true }, // Email liên hệ
    address: { type: String, required: true }, // Địa chỉ trụ sở chính
    logo: { type: String, default: "" }, // Link ảnh logo của nhà xe
    routes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Routes' }], // Danh sách tuyến đường nhà xe phục vụ
    timeStart: { type: Date, required: true }, // Thời gian khởi hành
    timeEnd: { type: Date, required: true }, // Thời gian kết thúc hành trình
    status: { type: Boolean, default: true }, // Trạng thái nhà xe (true: hoạt động, false: ngừng)
    rating: { type: Number, default: 0, min: 0, max: 5 }, // Điểm đánh giá trung bình (0-5)
    totalTrips: { type: Number, default: 0 }, // Tổng số chuyến xe đã chạy
    description: { type: String, default: "" }, // Mô tả chi tiết nhà xe
    createdAt: { type: Date, default: Date.now }, // Thời điểm tạo
    updatedAt: { type: Date, default: null } // Thời điểm cập nhật gần nhất
});

module.exports = mongoose.model('BusOperators', BusOperatorsSchema, 'bus_operators');
