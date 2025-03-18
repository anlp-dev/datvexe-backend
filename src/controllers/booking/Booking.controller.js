const {resExport} = require("../../enums/resExport");
const BookingService = require("../../services/booking/Booking.service")
class BookingController {
    async getByUser(req, res){
        try{
            const resData = await BookingService.getByUserId(req.params.id);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getById(req, res){
        try{
            const resData = await BookingService.getByBookingId(req.params.id);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getHistoryByUserId(req, res){
        try{
            const resData = await BookingService.getHistoryBookingByUserId(req.params.id);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getDiscountByUser(req, res){
        try{
            const resData = await BookingService.getDiscount();
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new BookingController();