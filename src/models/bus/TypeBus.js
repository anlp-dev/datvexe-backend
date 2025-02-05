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

// Tạo sẵn 2 loại xe: 34 giường và 20 giường khi khởi tạo DB
const defaultBusTypes = [
    { name: '34 giường', code: 'BUS34', seats: 34, features: ['WiFi', 'Nước uống', 'Điều hòa'], description: 'Xe giường nằm 34 chỗ tiện nghi' },
    { name: '20 giường', code: 'BUS20', seats: 20, features: ['WiFi', 'Điều hòa', 'Màn hình riêng'], description: 'Xe giường nằm 20 chỗ cao cấp' }
];

module.exports = mongoose.model('TypeBus', TypeBusSchema, 'type_bus');
