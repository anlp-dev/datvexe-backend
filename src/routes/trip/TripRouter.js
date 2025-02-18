const express = require("express");
const router = express.Router();
const TripController = require("../../controllers/trip/TripController");
const BusSchedule = require("../../models/trip/BuSchedule");
const BusOperator = require("../../models/bus/BusOperators");
const BusStation = require("../../models/trip/BusStation");
const TypeBus = require("../../models/bus/TypeBus");

router.get("/location/all", TripController.loadDiaDiem);

router.post("/schedule", TripController.loadSchedule);

// them moi lich trinh xe chay
// router.post("/themLoaiXe", async (req, res) => {
//     // Danh sách busOperator
//     const busOperators = [
//         "67b290f0f4d0673d14b0d912",
//         "67b2911ef2178546da2c3f2f",
//         "67b2913d5e39fef10810a06f",
//         "67b291596397b6c78e3b7140",
//         "67b291721fd1111b570bb7c3",
//         "67b2918b0601c873c11e6aaf",
//         "67b291bb71bcaafe61533a3b",
//         "67b291d60a33f2f9a419b2b3",
//         "67b291ecb97bd4203aebef51"
//     ];
//
//     // Danh sách bến xe
//     const benXes = [
//         "67aea15414cfeeb49c86e108",
//         "67aea18914cfeeb49c86e10e",
//         "67aea1a514cfeeb49c86e112"
//     ];
//
//     // Danh sách route (chỉ có 2 tuyến)
//     const routes = [
//         { route: "Hà Nội - Sapa", timeRoute: 6, price: 400000 },
//         { route: "Hà Nội - Lào Cai", timeRoute: 7, price: 450000 }
//     ];
//
//     // Hàm chọn ngẫu nhiên từ mảng
//     const getRandomItem = (arr, exclude = []) => {
//         let filteredArr = arr.filter(item => !exclude.includes(item));
//         return filteredArr[Math.floor(Math.random() * filteredArr.length)];
//     };
//
//     // Hàm tính toán thời gian xuất phát kế tiếp
//     const calculateNextStartTime = (startTime) => {
//         const nextStartTime = new Date(startTime);
//         nextStartTime.setHours(nextStartTime.getHours() + 2);
//         return nextStartTime;
//     };
//
//     for (let i = 0; i < busOperators.length; i++) {
//         const busOperator = busOperators[i];
//
//         const busOperatorData = await BusOperator.findById(busOperator).populate("types");
//
//         let benXeKhoiHanh, benXeDichDen;
//
//         // Chọn bến xe khởi hành
//         benXeKhoiHanh = getRandomItem(benXes);
//
//         // Nếu bến xe khởi hành là 1 trong 2 bến cần tránh trùng lặp, chỉ chọn bến còn lại
//         if (benXeKhoiHanh === "67aea18914cfeeb49c86e10e" || benXeKhoiHanh === "67aea1a514cfeeb49c86e112") {
//             benXeDichDen = getRandomItem(benXes, [benXeKhoiHanh, "67aea18914cfeeb49c86e10e", "67aea1a514cfeeb49c86e112"]);
//         } else {
//             benXeDichDen = getRandomItem(benXes, [benXeKhoiHanh]);
//         }
//
//         // Chọn tuyến đường ngẫu nhiên
//         const { route, timeRoute, price } = getRandomItem(routes);
//
//         // Tạo tripCode duy nhất
//         const tripCode = `TRIP-${i + 1}-${Math.random().toString(36).substring(7).toUpperCase()}`;
//
//         // Tạo lịch trình đi (lượt 1)
//         const timeStart = new Date();
//         timeStart.setHours(22, 0, 0); // 22:00
//
//         const newBusScheduleOut = new BusSchedule({
//             busOperator,
//             tripCode,
//             route,
//             timeRoute,
//             price,
//             date: new Date(),
//             timeStart: timeStart.toISOString(),
//             benXeKhoiHanh,
//             timeEnd: "05:00",
//             benXeDichDen,
//             availableSeats: busOperatorData.types.seats,
//         });
//
//         await newBusScheduleOut.save();
//         console.log(`🚍 Đã tạo lịch trình lượt đi: ${tripCode} - ${route} từ ${benXeKhoiHanh} đến ${benXeDichDen}`);
//
//         // Tạo lịch trình về (lượt 2), cách 2 tiếng
//         const timeStartBack = calculateNextStartTime(timeStart);
//
//         const tripCode2 = `TRIP-${i + 1}-${Math.random().toString(36).substring(7).toUpperCase()}`;
//
//         const newBusScheduleBack = new BusSchedule({
//             busOperator,
//             tripCode: tripCode2,
//             route: route === "Hà Nội - Sapa" ? "Sapa - Hà Nội" : "Lào Cai - Hà Nội",
//             timeRoute,
//             price,
//             date: new Date(),
//             timeStart: timeStartBack.toISOString(),
//             benXeKhoiHanh: benXeDichDen,
//             timeEnd: "05:00",
//             benXeDichDen: benXeKhoiHanh,
//             availableSeats: busOperatorData.types.seats,
//         });
//
//         await newBusScheduleBack.save();
//         console.log(`🚍 Đã tạo lịch trình lượt về: ${tripCode} - ${route} từ ${benXeDichDen} đến ${benXeKhoiHanh}`);
//     }
//
//     res.json(await BusSchedule.find({})
//         .populate("busOperator")
//         .populate({
//             path: "busOperator",
//             populate: {
//                 path: "types"
//             }
//         })
//         .populate("benXeKhoiHanh")
//         .populate("benXeDichDen")
//     );
// });

// router.get("/create/LocationTrip", async (req, res) => {
//     const locationTrip = await LocationTrip.find({}).populate("benXe");
//     res.json(locationTrip);
// })

module.exports = router;