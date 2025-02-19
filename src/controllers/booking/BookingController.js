const {resExport} = require("../../enums/resExport");
const BookingService = require("../../services/booking/BookingService")
class BookingController {
    async getByUser(req, res){
        try{
            const resData = await BookingService.getByUserId(req.params.id);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new BookingController();