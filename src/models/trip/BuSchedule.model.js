const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusScheduleSchema = new Schema({
    busOperator: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOperators', required: true }, // Nhà xe
    tripCode: { type: String, required: true, unique: true }, // Mã chuyến xe (VD: HN-DN-001)
    route: { type: String, required: true }, // Tuyến đường
    timeRoute: {type: Number, required: true}, // thoi gian chang duong
    price: {type: Number, required: true}, // gia tien
    date: { type: Date, required: true }, // Ngày khởi hành
    timeStart: { type: String, required: true }, // Giờ xuất phát (HH:mm)
    benXeKhoiHanh: {type: mongoose.Schema.Types.ObjectId, ref: "BusStation", required: true},
    timeEnd: { type: String, required: true }, // Giờ đến nơi (HH:mm)
    benXeDichDen: {type: mongoose.Schema.Types.ObjectId, ref: "BusStation", required: true},
    availableSeats: { type: Number, required: true }, // Số ghế còn trống
    seatSelected: [{type: String}],
    status: {
        type: String,
        enum: ['scheduled', 'departed', 'arrived', 'cancelled'],
        default: 'scheduled'
    }, // Trạng thái chuyến xe
    createdAt: { type: Date, default: Date.now }, // Thời gian tạo
    updatedAt: { type: Date, default: null } // Thời gian cập nhật
});

module.exports = mongoose.model('BusSchedule', BusScheduleSchema, 'bus_schedule');
