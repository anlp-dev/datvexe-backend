const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");

router.use("/auth", authRouter);
router.use("/trip", require("./trip/TripRouter"));
router.use("/booking", require("./booking/BookingRouter"));
router.use("/payment", require("./payment/PaymentRouter"));

module.exports = router;
