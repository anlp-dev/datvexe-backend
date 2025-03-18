const express = require("express");
const router = express.Router();
const BusSchedule = require("../../models/trip/BuSchedule.model");
const BusOperator = require("../../models/bus/BusOperators.model");
const BusStation = require("../../models/trip/BusStation.model");
const TypeBus = require("../../models/bus/TypeBus.model");
const BusTrip = require("../../models/trip/BusTrip.model");
const User = require("../../models/user/User.model");
const BookingController = require("../../controllers/booking/Booking.controller")

router.get("/user/:id", BookingController.getByUser);
router.get("/:id", BookingController.getById);
router.get("/history/user/:id", BookingController.getHistoryByUserId);
router.get("/discount/user", BookingController.getDiscountByUser)


module.exports = router;