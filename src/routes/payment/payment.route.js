const express = require("express");
const router = express.Router();
const PaymentController = require("../../controllers/payment/Payment.controller");

router.post("/create-url-vnpay", PaymentController.createPayment)
router.post("/create-vietqr", PaymentController.createVietQr)
router.put("/change-status", PaymentController.changeStatusPayment);


module.exports = router;