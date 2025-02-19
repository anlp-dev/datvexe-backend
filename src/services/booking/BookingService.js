const LocationTrip = require("../../models/trip/LocationTrip");
const BusStation = require("../../models/trip/BusStation");
const BusSchedule = require("../../models/trip/BuSchedule");
const TypeBus = require("../../models/bus/TypeBus");
const BusOperator = require("../../models/bus/BusOperators");
const BusTrip = require("../../models/trip/BusTrip");
class BookingService{
    async getByUserId(id){
        try{
            const busTrip = await BusTrip.find({user: id}).populate("busSchedule").populate("user", "fullname email phone").lean();
            if(busTrip.length < 1) throw new Error("Không tìm thấy lịch trình !")
            console.log(busTrip)
            return busTrip;
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new BookingService();