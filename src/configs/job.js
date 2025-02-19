const cron = require("node-cron");
const mongoose = require("mongoose");
const BusOperator = require("../models/bus/BusOperators");
const BusSchedule = require("../models/trip/BuSchedule");
const JobStatus = require("../models/system/JobStatus");

// Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/booking-car-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

console.log("\uD83D\uDE80 Job scheduler đang chạy...");

// Danh sách busOperator
const busOperators = [
    "67b290f0f4d0673d14b0d912", "67b2911ef2178546da2c3f2f", "67b2913d5e39fef10810a06f",
    "67b291596397b6c78e3b7140", "67b291721fd1111b570bb7c3", "67b2918b0601c873c11e6aaf",
    "67b291bb71bcaafe61533a3b", "67b291d60a33f2f9a419b2b3", "67b291ecb97bd4203aebef51"
];

const benXes = ["67aea15414cfeeb49c86e108", "67aea18914cfeeb49c86e10e", "67aea1a514cfeeb49c86e112"];

const routes = [
    { route: "Hà Nội - Sapa", timeRoute: 6, price: 400000 },
    { route: "Hà Nội - Lào Cai", timeRoute: 7, price: 450000 }
];

const getRandomItem = (arr, exclude = []) => arr.filter(item => !exclude.includes(item))[Math.floor(Math.random() * arr.length)];
const calculateNextStartTime = (startTime) => new Date(startTime.setHours(startTime.getHours() + 2));

const checkAndRunJob = async () => {
    const today = new Date().toISOString().split("T")[0];
    const jobStatus = await JobStatus.findOne();

    if (!jobStatus || jobStatus.lastRunDate !== today) {
        console.log("\uD83D\uDE8D Chưa chạy job hôm nay, bắt đầu chạy...");
        await createBusSchedule();
        jobStatus ? (jobStatus.lastRunDate = today, await jobStatus.save()) : await new JobStatus({ lastRunDate: today }).save();
        console.log("✅ Đã chạy job và cập nhật trạng thái.");
    } else {
        console.log("✅ Job hôm nay đã chạy rồi, không cần chạy lại.");
    }
};

const createBusSchedule = async () => {
    console.log("\uD83D\uDE8D Đang tạo lịch trình xe khách mới...");

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
            busOperator, tripCode: tripCode2, route: route.includes("Hà Nội") ? route.replace("Hà Nội", "") + " - Hà Nội" : route.split(" - ").reverse().join(" - "),
            timeRoute, price, date: new Date(),
            timeStart: timeStartBack.toISOString(), benXeKhoiHanh: benXeDichDen,
            timeEnd: timeEndBack.toISOString(), benXeDichDen: benXeKhoiHanh,
            availableSeats: busOperatorData.types.seats,
        }).save();

        console.log(`\uD83D\uDE8D Đã tạo lượt về: ${tripCode2} - ${route} từ ${benXeDichDen} đến ${benXeKhoiHanh}`);
    }
    console.log("✅ Hoàn thành tạo lịch trình mới!");
};

cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Đang chạy job lúc 00:00...");
    await checkAndRunJob();
});

console.log("🚀 Job đã được lên lịch chạy vào 00:00 mỗi ngày...");
