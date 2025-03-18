const express = require("express");
const router = express.Router();
const TripController = require("../../controllers/trip/Trip.controller");
const BusSchedule = require("../../models/trip/BuSchedule.model");
const BusOperator = require("../../models/bus/BusOperators.model");
const BusStation = require("../../models/trip/BusStation.model");
const TypeBus = require("../../models/bus/TypeBus.model");
const BusTrip = require("../../models/trip/BusTrip.model");
const User = require("../../models/user/User.model")
const {checkPermission} = require("../../middleware/AuthPermission");

router.get("/location/all", TripController.loadDiaDiem);
router.get("/schedule/:id", TripController.getScheduleById)
router.post("/schedule", TripController.loadSchedule);
router.post("/create", TripController.createTrip);
router.post("/cancel", TripController.cancelTrip);



module.exports = router;