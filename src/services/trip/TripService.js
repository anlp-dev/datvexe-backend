const LocationTrip = require("../../models/trip/LocationTrip");
const BusStation = require("../../models/trip/BusStation");
const BusSchedule = require("../../models/trip/BuSchedule");
const TypeBus = require("../../models/bus/TypeBus");
const BusOperator = require("../../models/bus/BusOperators");

class TripService {
    async getAllTrip() {
        try{
            const location = await LocationTrip.find({}).populate("benXe");
            return location;
        }catch (e) {
            throw new Error(e);
        }
    }

    async loadBusSchedule(data){
        try{
            const {benXeKhoiHanh, benXeDichDen, ngayKhoiHanh, soNguoi} = data;

            if(benXeKhoiHanh === benXeDichDen){
                throw new Error("Địa điểm không hợp lệ, vui lòng thử lại !");
            }

            if(ngayKhoiHanh < Date.now()){
                throw new Error("Ngày khởi hành không hợp lệ, vui lòng thử lại !");
            }
            const stationStart = await BusStation.findOne({maBenXe: benXeKhoiHanh});
            const stationEnd = await BusStation.findOne({maBenXe: benXeDichDen});
            const busSchedule = await BusSchedule.find({
                benXeKhoiHanh: stationStart._id,
                benXeDichDen: stationEnd._id,
                // date: ngayKhoiHanh
            })
                .populate({
                    path: "busOperator",
                    populate: { path: "types" }
                })
                .populate("benXeKhoiHanh")
                .populate("benXeDichDen")
                .lean();

            if(busSchedule.length < 1){
                throw new Error("Không tìm thấy chuyến xe!");
            }
            return busSchedule;
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new TripService();