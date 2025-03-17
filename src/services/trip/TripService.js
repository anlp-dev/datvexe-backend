const LocationTrip = require("../../models/trip/LocationTrip");
const BusStation = require("../../models/trip/BusStation");
const BusSchedule = require("../../models/trip/BuSchedule");
const TypeBus = require("../../models/bus/TypeBus");
const BusOperator = require("../../models/bus/BusOperators");
const BusTrip = require("../../models/trip/BusTrip");
const Notifice = require("../../models/system/Notifice");
const TYPE_THONG_BAO = require("../../enums/typeThongBao");
const User = require("../../models/user/User");
const Discount = require("../../models/booking/Discount")
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
            const departureDate = new Date(date).getTime();
            if(departureDate < Date.now()){
                throw new Error("Ngày khởi hành không hợp lệ, vui lòng thử lại !");
            }
            const stationStart = await BusStation.findOne({maBenXe: benXeKhoiHanh});
            const stationEnd = await BusStation.findOne({maBenXe: benXeDichDen});
            const busSchedule = await BusSchedule.find({
                benXeKhoiHanh: stationStart._id,
                benXeDichDen: stationEnd._id,
                status: "scheduled",
                // date: {$eq: date}
            })
                .populate({
                    path: "busOperator",
                    populate: { path: "types" }
                })
                .populate("benXeKhoiHanh")
                .populate("benXeDichDen");
            const filterBusSchedule = busSchedule.filter((item) => {
                return new Date(item.date).toISOString().split("T")[0] === new Date(date).toISOString().split("T")[0];
            });

            if(filterBusSchedule.length < 1){
                throw new Error("Không tìm thấy chuyến xe phù hợp với lựa chọn của bạn!");
            }
            console.log(filterBusSchedule)
            return filterBusSchedule;
        }catch (e) {
            throw new Error(e);
        }
    }

    async createBusTrip(dataReq){
        try{
            const {user, busSchedule, totalPrice,
                seats, pickupLocation, dropoffLocation, departureTime,
                exportInvoice, note, paymentMethod, usePoint, selectPromotion} = dataReq;

            const checkBusSchedule = await BusSchedule.findById(busSchedule);
            if(!checkBusSchedule){
                throw new Error("Lịch trình không tồn tại !");
            }
            checkBusSchedule.seatSelected = [...(Array.isArray(checkBusSchedule.seatSelected) ? checkBusSchedule.seatSelected : []), ...seats];
            const totalSeats = seats.length;
            checkBusSchedule.availableSeats = checkBusSchedule.availableSeats - totalSeats;
            await checkBusSchedule.save();
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

            if(usePoint > 0){
                await User.findByIdAndUpdate(user, {$inc: {loyaltyPoints: -usePoint}});
            }

            if(selectPromotion){
                await Discount.findByIdAndUpdate(selectPromotion, {$inc: {quantity: -1}});
            }

           const newNotifice = new Notifice({
                type: TYPE_THONG_BAO.SUCCESS,
                title: "Đặt xe thành công",
                message: `Chuyến xe của quý khách khởi hành từ ${pickupLocation} tới ${dropoffLocation} vào lúc ${departureTime}`,
                tab: "events",
                user: user,
            })

            await newNotifice.save();

            return BusTrip.find({code: newTrip.code}).populate("user").populate("busSchedule");
        }catch (e) {
            throw new Error(e);
        }
    }

    async cancelBusTrip(dataReq){
        try{
            const {id, reason} = dataReq;
            const busTrip = await BusTrip.findById(id);
            if(!busTrip){
                throw new Error("Vé không tồn tại !");
            }
            busTrip.status = "cancelled";
            busTrip.reasonCancel = reason;
            await busTrip.save();

            const checkBusSchedule = await BusSchedule.findById(busTrip.busSchedule);
            checkBusSchedule.seatSelected = checkBusSchedule.seatSelected.filter(seat => !busTrip.seats.includes(seat));
            checkBusSchedule.availableSeats = checkBusSchedule.availableSeats + busTrip.seats.length;

            await checkBusSchedule.save();

            const newNotifice = new Notifice({
                type: TYPE_THONG_BAO.CANCEL,
                title: `Hủy vé thành công vé ${busTrip.code}`,
                message: `Quý khách huyệt xe với lý do: ${reason}`,
                tab: "events",
                user: busTrip.user,
            })
            await newNotifice.save();
            return busTrip;
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new TripService();