const LocationTrip = require("../../models/trip/LocationTrip.model");
const BusStation = require("../../models/trip/BusStation.model");
const BusSchedule = require("../../models/trip/BuSchedule.model");
const TypeBus = require("../../models/bus/TypeBus.model");
const BusOperator = require("../../models/bus/BusOperators.model");
const BusTrip = require("../../models/trip/BusTrip.model");
const Discount = require("../../models/booking/Discount.model")
class BookingService{
    async getByUserId(id) {
        try {
            const busTrip = await BusTrip.find({
                user: id,
                status: { $in: ["pending", "confirmed", "payed"] }
            })
                .populate("busSchedule")
                .populate("user", "fullname email phone")
                .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần
                .lean();

            if (busTrip.length < 1) throw new Error("Không tìm thấy lịch trình!");

            console.log(busTrip);
            return busTrip;
        } catch (e) {
            throw new Error(e.message);
        }
    }



    async getByBookingId(id){
        try{
            const busTrip = await BusTrip.findById(id).populate("busSchedule").populate("user", "fullname email phone").lean();
            if(busTrip.length < 1) throw new Error("Không tìm thấy lịch trình !")
            console.log(busTrip)
            return busTrip;
        }catch (e) {
            throw new Error(e);
        }
    }

    async getHistoryBookingByUserId(id){
        try{
            const busTrip = await BusTrip.find({
                user: id,
                status: { $in: ["cancelled", "completed"] }
            })
                .populate("busSchedule")
                .sort({createdAt: -1})
                .lean();

            if (busTrip.length < 1) throw new Error("Không tìm thấy lịch trình!");

            console.log(busTrip);
            return busTrip;
        }catch (e) {
            throw new Error(e);
        }
    }

    async getDiscount(){
        try{
            const resDiscount = await Discount.find({status: "01", quantity: {$gt: 0}});
            if(!resDiscount) throw new Error("Không tìm thấy mã giảm giá !")
            let responseData = [];
            resDiscount.forEach(item => {
                responseData.push({
                    id: item._id,
                    code: item.code,
                    discount: item.percent,
                    description: item.description
                })
            })
            return responseData;
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new BookingService();