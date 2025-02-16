const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");

router.use("/auth", authRouter);
router.use("/trip", require("./trip/TripRouter"));

module.exports = router;
