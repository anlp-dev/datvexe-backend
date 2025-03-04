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

            return BusTrip.find({code: newTrip.code}).populate("user").populate("busSchedule");
        }catch (e) {
            throw new Error(e);
        }
    }

    async generateTrip(data) {
        try{
            const {dateReq} = data;
            const startDate = new Date(`${dateReq}T00:00:00.000Z`);
            const endDate = new Date(`${dateReq}T23:59:59.999Z`);
            const checkBusSchedule = await BusSchedule.findOne({date: {$gte: startDate, $lte: endDate}});
            if(checkBusSchedule){
                throw new Error(`Lịch trình ngày ${dateReq} đã được tạo, vui lòng thử lại với lịch trình của ngày khác !`);
            }
            const busOperators = (await BusOperator.find({}, "_id").lean()).map(op => op._id);
            const benXes = (await BusStation.find({}, "_id").lean()).map(station => station._id);
            const routes = [
                { route: "Hà Nội - Sapa", timeRoute: 6, price: 400000 },
                { route: "Hà Nội - Lào Cai", timeRoute: 7, price: 450000 }
            ];

            // Hàm chọn ngẫu nhiên từ mảng
            const getRandomItem = (arr, exclude = []) => {
                let filteredArr = arr.filter(item => !exclude.includes(item));
                return filteredArr[Math.floor(Math.random() * filteredArr.length)];
            };

            // Hàm tính toán thời gian xuất phát kế tiếp
            const calculateNextStartTime = (startTime) => {
                const nextStartTime = new Date(startTime);
                nextStartTime.setHours(nextStartTime.getHours() + 2);
                return nextStartTime;
            };

            for (let i = 0; i < busOperators.length; i++) {
                const busOperator = busOperators[i];
                const busOperatorData = await BusOperator.findById(busOperator).populate("types");

                let benXeKhoiHanh = getRandomItem(benXes);
                let benXeDichDen = getRandomItem(benXes, [benXeKhoiHanh]);

                const { route, timeRoute, price } = getRandomItem(routes);
                const tripCode = `SAOVIET-${i + 1}-${Math.random().toString(36).substring(7).toUpperCase()}`;

                const randomStartTime = new Date();
                randomStartTime.setHours(8 + Math.floor(Math.random() * 8) * 3, 0, 0);

                const timeEnd = new Date(randomStartTime);
                timeEnd.setHours(timeEnd.getHours() + timeRoute);

                await new BusSchedule({
                    busOperator, tripCode, route, timeRoute, price, date: new Date(),
                    timeStart: randomStartTime.toISOString(), benXeKhoiHanh,
                    timeEnd: timeEnd.toISOString(), benXeDichDen,
                    availableSeats: busOperatorData.types.seats,
                }).save();

                console.log(`\uD83D\uDE8D Đã tạo lượt đi: ${tripCode} - ${route} từ ${benXeKhoiHanh} đến ${benXeDichDen}`);

                const tripCode2 = `SAOVIET-${i + 1}-${Math.random().toString(36).substring(7).toUpperCase()}`;
                const timeStartBack = calculateNextStartTime(timeEnd);
                const timeEndBack = new Date(timeStartBack);
                timeEndBack.setHours(timeEnd.getHours() + timeRoute);

                await new BusSchedule({
                    busOperator,
                    tripCode: tripCode2,
                    route: route.includes("Hà Nội")
                        ? route.replace("Hà Nội", "").trim().replace(/^-\s*/, '') + " - Hà Nội"
                        : route.split(" - ").reverse().join(" - "),
                    timeRoute,
                    price,
                    date: new Date(dateReq),
                    timeStart: timeStartBack.toISOString(),
                    benXeKhoiHanh: benXeDichDen,
                    timeEnd: timeEndBack.toISOString(),
                    benXeDichDen: benXeKhoiHanh,
                    availableSeats: busOperatorData.types.seats,
                }).save();

                console.log(`\uD83D\uDE8D Đã tạo lượt về: ${tripCode2} - ${route} từ ${benXeDichDen} đến ${benXeKhoiHanh}`);
            }
            return await BusSchedule.find({})
                .populate("busOperator")
                .populate({
                    path: "busOperator",
                    populate: {
                        path: "types"
                    }
                })
                .populate("benXeKhoiHanh")
                .populate("benXeDichDen");
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new TripService();