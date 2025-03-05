const express = require("express");
const router = express.Router();
const TripController = require("../../controllers/trip/TripController");
const BusSchedule = require("../../models/trip/BuSchedule");
const BusOperator = require("../../models/bus/BusOperators");
const BusStation = require("../../models/trip/BusStation");
const TypeBus = require("../../models/bus/TypeBus");
const BusTrip = require("../../models/trip/BusTrip");
const User = require("../../models/user/User")
const {checkPermission} = require("../../middleware/AuthPermission");

router.get("/location/all", TripController.loadDiaDiem);
router.get("/schedule/:id", TripController.getScheduleById)
router.post("/schedule", TripController.loadSchedule);
router.post("/create", TripController.createTrip);
router.post("/cancel", TripController.cancelTrip);
router.post("/generate", checkPermission("CRUD_BUS_SCHEDULE"), TripController.generate);


module.exports = router;