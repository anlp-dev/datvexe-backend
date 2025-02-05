const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingTripSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người đặt vé
    busOperator: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOperators', required: true }, // Nhà xe
    price: { type: Number, required: true }, // Giá vé
    seats: [{ type: String, required: true }], // Danh sách số ghế đã đặt
    pickupLocation: { type: String, required: true }, // Điểm đón
    dropoffLocation: { type: String, required: true }, // Điểm trả khách
    departureTime: { type: Date, required: true }, // Thời gian khởi hành
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    }, // Trạng thái vé
    paymentMethod: {
        type: String,
        enum: ['cash', 'VNPay', 'MoMo'],
        required: true
    }, // Phương thức thanh toán
    transactionId: { type: String, default: null }, // Mã giao dịch (nếu thanh toán online)
    createdAt: { type: Date, default: Date.now }, // Thời gian đặt vé
    updatedAt: { type: Date, default: null } // Thời gian cập nhật đơn vé
});

module.exports = mongoose.model('BookingTrip', BookingTripSchema, 'booking_trip');
