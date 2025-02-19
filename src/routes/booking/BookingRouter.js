const express = require("express");
const router = express.Router();
const BusSchedule = require("../../models/trip/BuSchedule");
const BusOperator = require("../../models/bus/BusOperators");
const BusStation = require("../../models/trip/BusStation");
const TypeBus = require("../../models/bus/TypeBus");
const BusTrip = require("../../models/trip/BusTrip");
const User = require("../../models/user/User");
const BookingController = require("../../controllers/booking/BookingController")

router.get("/user/:id", BookingController.getByUser);


module.exports = router;