const querystring = require("qs");
const crypto = require("crypto");
const QRCode = require("qrcode");
const crc = require("crc");
const axios = require("axios");
const Transaction = require("../../models/booking/Transaction");

class PaymentService {
    constructor() {
        this.vnpTmnCode = "PM4KZ9GU";
        this.vnpHashSecret = "E2VAY4DNJTQ7544ENWZA1GNKMFULXKG1";
        this.vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        // this.vnpUrl = "https://pay.vnpay.vn/vpcpay.html"
    }

     sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj){
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }


    createPaymentUrl(dataReq) {
        try {
            let ipAddr =
                dataReq.headers["x-forwarded-for"] ||
                dataReq.connection?.remoteAddress ||
                dataReq.socket?.remoteAddress ||
                dataReq.connection?.socket?.remoteAddress;

            let tmnCode = this.vnpTmnCode;
            let secretKey = this.vnpHashSecret;
            let vnpUrl = this.vnpUrl;
            let returnUrl = "http://localhost:8888/order/vnpay_return";

            let date = new Date();
            let createDate = date.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14); // Format YYYYMMDDHHmmss

            let orderId = dataReq.body.orderId;
            let totalPrice = dataReq.body.totalPrice;
            let bankCode = dataReq.body.bankCode;
            let orderInfo = dataReq.body.orderInfo;
            let orderType = dataReq.body.orderType;
            let locale = dataReq.body.language || "vn";
            let currCode = "VND";

            let vnp_Params = {
                vnp_Version: "2.1.0",
                vnp_Command: "pay",
                vnp_TmnCode: tmnCode,
                vnp_Locale: locale,
                vnp_CurrCode: currCode,
                vnp_TxnRef: orderId,
                vnp_OrderInfo: orderInfo,
                vnp_OrderType: orderType,
                vnp_Amount: totalPrice * 100,
                vnp_ReturnUrl: returnUrl,
                vnp_IpAddr: ipAddr,
                vnp_CreateDate: createDate,
                // vnp_BankCode: "VNPAYQR"
            };
            if (bankCode) {
                vnp_Params["vnp_BankCode"] = bankCode;
            }

            vnp_Params = this.sortObject(vnp_Params);
            let signData = querystring.stringify(vnp_Params, { encode: false });

            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

            vnp_Params["vnp_SecureHash"] = signed;
            vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

            return vnpUrl;
        } catch (e) {
            throw new Error(e.message);
        }
    }


    calculateCRC16(data) {
        return crc.crc16ccitt(data).toString(16).toUpperCase().padStart(4, "0");
    }

// Hàm tạo QR VietQR hợp lệ
    async createVietQR(dataReq) {
        try {
            const VIETQR_API = "https://api.vietqr.io/v2/generate";
            const { bankCode, accountNumber, accountName, amount, description } = dataReq;


            const payload = {
                acqId: bankCode,
                accountNo: accountNumber,
                accountName: accountName,
                amount: amount,
                addInfo: description,
                format: "text"
            };

            // Gọi API VietQR
            const { data } = await axios.post(VIETQR_API, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log(data.data.qrCode)

            const qrCode = await QRCode.toDataURL(data.data.qrCode);

            console.log(qrCode)

            return qrCode;

            // if (data && data.data) {
            //     // Tạo QR code từ nội dung VietQR trả về
            //     const qrCode = await QRCode.toDataURL(data.data.qrData);
            //
            //     return{
            //         qrData: data.data.qrData,
            //         qrImage: qrCode
            //     };
            // } else {
            //     throw new Error("Không thể tạo VietQR");
            // }
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = new PaymentService();
