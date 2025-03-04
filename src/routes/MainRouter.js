const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");
const paymentRouter = require("./payment/PaymentRouter");
const bookingRouter = require("./booking/BookingRouter");
const tripRouter = require("./trip/TripRouter");
const systemRouter = require("./system/SystemRouter");
const adminRouter = require("./admin/AdminRouter");
const notificeRouter = require("./system/NotificeRouter");

router.use("/auth", authRouter);
router.use("/trip",tripRouter);
router.use("/booking", bookingRouter);
router.use("/payment", paymentRouter);
router.use("/system", systemRouter);
router.use("/admin", adminRouter);
router.use("/notifice", notificeRouter);

module.exports = router;
