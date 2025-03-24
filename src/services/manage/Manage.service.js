const BusStation = require("../../models/trip/BusStation.model");
const BusSchedule = require("../../models/trip/BuSchedule.model");
const TypeBus = require("../../models/bus/TypeBus.model");
const BusOperator = require("../../models/bus/BusOperators.model");
const BusTrip = require("../../models/trip/BusTrip.model");
const TYPE_THONG_BAO = require("../../enums/typeThongBao");
const User = require("../../models/user/User.model")
const Notifice = require("../../models/system/Notifice.model");
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

    async getAllScheduleByAdmin(){
        try{
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const busSchedule = await BusSchedule.find({
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }).populate({
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

    async updateStatusBusSchedule(dataReq) {
        try{
            const {id, status}  = dataReq;
            console.log(dataReq)
            const busSchedule = await BusSchedule.findById(id);
            if(!busSchedule){
                throw new Error("Vé không tồn tại !");
            }
            busSchedule.status = status;
            await busSchedule.save();

            if(status === "arrived"){
                await BusTrip.updateMany(
                    { busSchedule: busSchedule._id },
                    { $set: { status: "completed" } }
                );

                const users = await BusTrip.distinct("user", { busSchedule: busSchedule._id });

                const updatePoint = 20000;

                await User.updateMany(
                    {_id: { $in: users}},
                    { $inc: {loyaltyPoints: updatePoint }}
                )

                const notifications = users.map(userId => ({
                    type: "points",
                    title: "Cộng điểm",
                    message: `Cộng ${updatePoint} điểm vì bạn đã hoàn thành chuyến đi ${busSchedule.route}`,
                    tab: "promotions",
                    user: userId
                }));

                await Notifice.insertMany(notifications)
            }else if(status === "departed"){
                await BusTrip.updateMany(
                    { busSchedule: busSchedule._id },
                    { $set: { status: "confirmed" } }
                );
            }
            return busSchedule;
        }catch (e) {
            throw new Error(e);
        }
    }

    async cancelBusScheduleByAdmin(id) {
        try{
            const busSchedule = await BusSchedule.findById(id);
            if(!busSchedule){
                throw new Error("Vé không tồn tại !");
            }
            busSchedule.status = "cancelled";
            await busSchedule.save();
            await BusTrip.updateMany({
                busSchedule: busSchedule._id
            }, {
                $set: {status: "cancelled"}
            })

            const user = await BusTrip.distinct("user", { busSchedule: busSchedule._id });

            const notifications = user.map(userId => ({
                type: "info",
                title: "Hủy chuyến",
                message: `Vé trên chuyến xe ${busSchedule.route} đã bị hủy do thời tiết xấu`,
                tab: "events",
                user: userId
            }))

            await Notifice.insertMany(notifications);
            return busSchedule;
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

module.exports = new ManageService();