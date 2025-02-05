const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusScheduleSchema = new Schema({
    busOperator: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOperators', required: true }, // Nhà xe
    locationBusStation: { type: mongoose.Schema.Types.ObjectId, ref: 'BusStation', required: true }, // Bến xe
    tripCode: { type: String, required: true, unique: true }, // Mã chuyến xe (VD: HN-DN-001)
    pickupLocation: { type: String, required: true }, // Điểm đón khách
    dropoffLocation: { type: String, required: true }, // Điểm trả khách
    date: { type: Date, required: true }, // Ngày khởi hành
    timeStart: { type: String, required: true }, // Giờ xuất phát (HH:mm)
    timeEnd: { type: String, required: true }, // Giờ đến nơi (HH:mm)
    availableSeats: { type: Number, required: true }, // Số ghế còn trống
    status: {
        type: String,
        enum: ['scheduled', 'departed', 'arrived', 'cancelled'],
        default: 'scheduled'
    }, // Trạng thái chuyến xe
    createdAt: { type: Date, default: Date.now }, // Thời gian tạo
    updatedAt: { type: Date, default: null } // Thời gian cập nhật
});

module.exports = mongoose.model('BusSchedule', BusScheduleSchema, 'bus_schedule');
