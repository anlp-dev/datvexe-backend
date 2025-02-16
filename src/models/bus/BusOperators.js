const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusOperatorsSchema = new Schema({
    name: { type: String, required: true, unique: true }, // Tên nhà xe
    types: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeBus', required: true }, // Loại xe
    phone: { type: String, required: true }, // Số điện thoại
    status: { type: Boolean, default: true }, // Trạng thái nhà xe (true: hoạt động, false: ngừng)
    rating: { type: Number, default: 0, min: 0, max: 5 }, // Điểm đánh giá trung bình (0-5)
    totalTrips: { type: Number, default: 0 }, // Tổng số chuyến xe đã chạy
    description: { type: String, default: "" }, // Mô tả chi tiết nhà xe
    createdAt: { type: Date, default: Date.now }, // Thời điểm tạo
    updatedAt: { type: Date, default: null } // Thời điểm cập nhật gần nhất
});

module.exports = mongoose.model('BusOperators', BusOperatorsSchema, 'bus_operators');
