const LocationTrip = require("../../models/trip/LocationTrip");
const BusStation = require("../../models/trip/BusStation");
const BusSchedule = require("../../models/trip/BuSchedule");
const TypeBus = require("../../models/bus/TypeBus");
const BusOperator = require("../../models/bus/BusOperators");
const BusTrip = require("../../models/trip/BusTrip");
const generateTicketCode = require("../../utils/generate");

class TripService {
    async getAllTrip() {
        try{
            const location = await LocationTrip.find({}).populate("benXe");
            return location;
        }catch (e) {
            throw new Error(e);
        }
    }

    async getScheduleById(id){
        try{
            const busSchedule = await BusSchedule.findById(id)
                .populate({
                path: "busOperator",
                populate: { path: "types" }
            })
                .populate("benXeKhoiHanh")
                .populate("benXeDichDen")
                .lean();

            console.log(busSchedule)

            if(busSchedule == null){
                throw new Error("Không tìm thấy lịch trình !")
            }
            return busSchedule;
        }catch (e) {
            throw new Error(e);
        }
    }

    async loadBusSchedule(data){
        try{
            const {benXeKhoiHanh, benXeDichDen, date, soNguoi} = data;

            if(benXeKhoiHanh === benXeDichDen){
                throw new Error("Địa điểm không hợp lệ, vui lòng thử lại !");
            }

            if(date < Date.now()){
                throw new Error("Ngày khởi hành không hợp lệ, vui lòng thử lại !");
            }
            const stationStart = await BusStation.findOne({maBenXe: benXeKhoiHanh});
            const stationEnd = await BusStation.findOne({maBenXe: benXeDichDen});
            const busSchedule = await BusSchedule.find({
                benXeKhoiHanh: stationStart._id,
                benXeDichDen: stationEnd._id,
                // date: {$eq: date}
            })
                .populate({
                    path: "busOperator",
                    populate: { path: "types" }
                })
                .populate("benXeKhoiHanh")
                .populate("benXeDichDen")
                .lean();

            const filterBusSchedule = busSchedule.filter((item) => {
                return new Date(item.date).toISOString().split("T")[0] === new Date(date).toISOString().split("T")[0];
            });

            if(filterBusSchedule.length < 1){
                throw new Error("Không tìm thấy chuyến xe phù hợp với lựa chọn của bạn!");
            }
            return filterBusSchedule;
        }catch (e) {
            throw new Error(e);
        }
    }

    async createBusTrip(dataReq){
        try{
            const {user, busSchedule, totalPrice,
                seats, pickupLocation, dropoffLocation, departureTime,
                exportInvoice, note, paymentMethod} = dataReq;

            console.log(dataReq)

            console.log(totalPrice)

            const ticketCode = generateTicketCode();

            const newTrip = new BusTrip({
                code: ticketCode,
                user: user,
                busSchedule: busSchedule,
                totalPrice: totalPrice,
                seats: seats,
                pickupLocation: pickupLocation,
                dropoffLocation: dropoffLocation,
                departureTime: departureTime,
                exportInvoice: exportInvoice,
                note: note,
                paymentMethod: paymentMethod,
            })

            await newTrip.save();

            return BusTrip.find({code: newTrip.code}).populate("user").populate("busSchedule");
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new TripService();