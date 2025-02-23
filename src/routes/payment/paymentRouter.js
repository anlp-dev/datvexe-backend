const express = require("express");
const router = express.Router();
const PaymentController = require("../../controllers/payment/PaymentController");

router.post("/create-url-vnpay", PaymentController.createPayment)
// router.post("/create-vietqr", PaymentController.createVietQr)


module.exports = router;