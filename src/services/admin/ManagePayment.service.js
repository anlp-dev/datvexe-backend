const BusTrip = require("../../models/trip/BusTrip.model");
const User = require("../../models/user/User.model");
const BusSchedule = require("../../models/trip/BuSchedule.model");
const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const {getTemplateReportInvoicePdf} = require("../../utils/reportTemplate");

class ManagePaymentService {
    async getAllPayment(){
        try{
            const dataPayment = await BusTrip.find({}).populate("user", "fullname").populate("busSchedule", "route");
            if(dataPayment.length < 1) throw new Error("Không tìm thấy dữ liệu thanh toán !")
            let responseData = [];
            dataPayment.forEach(dataPay => {
                responseData.push({
                    id: dataPay._id,
                    bookingCode: dataPay.code,
                    amount: dataPay.totalPrice,
                    paymentMethod: dataPay.paymentMethod,
                    paymentDate: dataPay.createdAt,
                    status: dataPay.status,
                    customerName: dataPay.user.fullname,
                    routeName: dataPay.busSchedule.route
                })
            })
            return responseData;
        }catch (e) {
            throw new Error(e);
        }
    }

    async exportPdf(dataReq){
        try {
            const { datePay, bookingCode, customerName, route, paymentMethod, status, totalPrice } = dataReq;

            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();

            const htmlContent = getTemplateReportInvoicePdf(datePay, bookingCode, customerName, route, paymentMethod, status, totalPrice);
            await page.setContent(htmlContent);

            const pdfBuffer = await page.pdf({ format: 'A4' });

            await browser.close();

            return pdfBuffer.toString("base64");
        } catch (e) {
            throw new Error(e);
        }
    }

    getStatus(status){
        switch(status){
            case "payed":
                return "Thành công";
            case "unpaid":
                return "Chờ thanh toán";
            case "error":
                return "Lỗi";
            case "cancelled":
                return "Đã hoàn tiền";
            default:
                return "Chờ thanh toán";
        }
    }

    formatCurrency = (amount, currency = 'VND', locale = 'vi-VN') => {
        if (isNaN(amount)) return amount * 1000;
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount * 1000);
    };
}

module.exports = new ManagePaymentService();