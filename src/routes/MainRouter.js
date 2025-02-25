const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");
const paymentRouter = require("./payment/PaymentRouter");
const bookingRouter = require("./booking/BookingRouter");
const tripRouter = require("./trip/TripRouter");

router.use("/auth", authRouter);
router.use("/trip",tripRouter);
router.use("/booking", bookingRouter);
router.use("/payment", paymentRouter);

module.exports = router;
