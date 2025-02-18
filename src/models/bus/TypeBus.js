const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeBusSchema = new Schema({
    name: { type: String, required: true, unique: true }, // Tên loại xe (VD: 34 giường, 20 giường)
    code: { type: String, required: true, unique: true }, // Mã loại xe
    seats: { type: Number, required: true }, // Số lượng giường/ngồi trên xe
    features: [{ type: String, default: [] }], // Danh sách tiện ích trên xe
    description: { type: String, default: "" }, // Mô tả loại xe
    createdAt: { type: Date, default: Date.now }, // Thời điểm tạo
    updatedAt: { type: Date, default: null } // Thời điểm cập nhật gần nhất
});

module.exports = mongoose.model('TypeBus', TypeBusSchema, 'type_bus');
