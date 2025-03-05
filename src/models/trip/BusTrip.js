const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingTripSchema = new Schema({
    code: {type: String, required: true, unique: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người đặt vé
    busSchedule: {type: mongoose.Schema.Types.ObjectId, ref: 'BusSchedule', required: true}, // Chuyến xe
    surcharge: { type: Number, required: true, default: 0 }, // Phu thu
    totalPrice: { type: Number, required: true }, // Giá vé
    seats: [{ type: String, required: true }], // Danh sách số ghế đã đặt
    pickupLocation: { type: String, required: true }, // Điểm đón
    dropoffLocation: { type: String, required: true }, // Điểm trả khách
    departureTime: { type: Date, required: true, default: Date.now }, // Thời gian khởi hành
    exportInvoice: {type: Boolean, required: true, default: false},
    note: {type: String},
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'payed', 'cancelled', 'completed', 'draft'],
        default: 'pending'
    }, // Trạng thái vé
    paymentMethod: {
        type: String,
        enum: ['cash', 'VNPay', 'Banking'],
        required: true,
        default: 'cash'
    }, // Phương thức thanh toán,
    reasonCancel: { type: String, default: null }, // Lý do hủy vé
    transactionId: { type: String, default: null }, // Mã giao dịch (nếu thanh toán online)
    createdAt: { type: Date, default: Date.now }, // Thời gian đặt vé
    updatedAt: { type: Date, default: null } // Thời gian cập nhật đơn vé
});

module.exports = mongoose.model('BookingTrip', BookingTripSchema, 'booking_trip');
