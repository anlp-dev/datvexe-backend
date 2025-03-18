const express = require("express");
const router = express.Router();
const authRouter = require("./auth/Auth.route");
const paymentRouter = require("./payment/payment.route");
const bookingRouter = require("./booking/Booking.route");
const tripRouter = require("./trip/Trip.route");
const systemRouter = require("./system/System.route");
const adminRouter = require("./admin/Admin.route");
const notificeRouter = require("./system/Notifice.route");
const managerRouter = require("./manage/Manage.route");

router.use("/auth", authRouter);
router.use("/trip",tripRouter);
router.use("/booking", bookingRouter);
router.use("/payment", paymentRouter);
router.use("/system", systemRouter);
router.use("/admin", adminRouter);
router.use("/notifice", notificeRouter);
router.use("/manage", managerRouter);

module.exports = router;
