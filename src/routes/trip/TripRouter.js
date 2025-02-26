const express = require("express");
const router = express.Router();
const TripController = require("../../controllers/trip/TripController");
const BusSchedule = require("../../models/trip/BuSchedule");
const BusOperator = require("../../models/bus/BusOperators");
const BusStation = require("../../models/trip/BusStation");
const TypeBus = require("../../models/bus/TypeBus");
const BusTrip = require("../../models/trip/BusTrip");
const User = require("../../models/user/User")

router.get("/location/all", TripController.loadDiaDiem);
router.get("/schedule/:id", TripController.getScheduleById)
router.post("/schedule", TripController.loadSchedule);
router.post("/create", TripController.createTrip);

// them moi lich trinh xe chay
router.post("/generate", async (req, res) => {
    // Danh sách busOperator
    const busOperators = [
        "67b290f0f4d0673d14b0d912",
        "67b2911ef2178546da2c3f2f",
        "67b2913d5e39fef10810a06f",
        "67b291596397b6c78e3b7140",
        "67b291721fd1111b570bb7c3",
        "67b2918b0601c873c11e6aaf",
        "67b291bb71bcaafe61533a3b",
        "67b291d60a33f2f9a419b2b3",
        "67b291ecb97bd4203aebef51"
    ];

    // Danh sách bến xe
    const benXes = [
        "67aea15414cfeeb49c86e108",
        "67aea18914cfeeb49c86e10e",
        "67aea1a514cfeeb49c86e112"
    ];

    // Danh sách route (chỉ có 2 tuyến)
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
            date: new Date(),
            timeStart: timeStartBack.toISOString(),
            benXeKhoiHanh: benXeDichDen,
            timeEnd: timeEndBack.toISOString(),
            benXeDichDen: benXeKhoiHanh,
            availableSeats: busOperatorData.types.seats,
        }).save();

        console.log(`\uD83D\uDE8D Đã tạo lượt về: ${tripCode2} - ${route} từ ${benXeDichDen} đến ${benXeKhoiHanh}`);
    }

    res.json(await BusSchedule.find({})
        .populate("busOperator")
        .populate({
            path: "busOperator",
            populate: {
                path: "types"
            }
        })
        .populate("benXeKhoiHanh")
        .populate("benXeDichDen")
    );
});

router.get("/create/LocationTrip", async (req, res) => {
    const locationTrip = await BusTrip.find({}).populate("user").populate("busSchedule");
    res.json(locationTrip);
})

module.exports = router;