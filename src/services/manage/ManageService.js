const BusSchedule = require("../../models/trip/BuSchedule");
const BusOperator = require("../../models/bus/BusOperators");
const TypeBus = require("../../models/bus/TypeBus");
const BusStation = require("../../models/trip/BusStation");
class ManageService{
    async getAllSchedule(){
        try{
            const busSchedule = await BusSchedule.find({})
                .populate({
                    path: "busOperator",
                    populate: { path: "types" }
                })
                .populate("benXeKhoiHanh")
                .populate("benXeDichDen");
            if(!busSchedule) throw new Error("Không tìm thấy lịch trình !");
            return busSchedule;
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new ManageService();