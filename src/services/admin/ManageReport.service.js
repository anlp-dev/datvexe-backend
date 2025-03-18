const BusTrip = require("../../models/trip/BusTrip.model")

class ManageReportService {
    async getDoanhThu(yearReq){
        try{
            const yearFilter = parseInt(yearReq) || new Date().getFullYear();
            const startDate = new Date(yearFilter, 0, 1);  // Ngày 1 tháng 1 của năm đó
            const endDate = new Date(yearFilter + 1, 0, 1); // Ngày 1 tháng 1 của năm sau

            const dataBusTrip = await BusTrip.find({ status: { $in: ['confirmed', 'payed', 'completed'] }, createdAt: {
                    $gte: startDate,
                    $lt: endDate,
                } }).populate('busSchedule', 'route');

            let revenueByMonth = {};

            dataBusTrip.forEach(dTrip => {
                const month = new Date(dTrip.createdAt).getMonth() + 1;
                console.log('run')
                if (!revenueByMonth[month]) {
                    revenueByMonth[month] = {totalTicket: 0, totalRevenue: 0};
                }
                revenueByMonth[month].totalTicket += 1;
                revenueByMonth[month].totalRevenue += dTrip.totalPrice;
            })

            let totalRevenue = 0;
            let totalTicket = dataBusTrip.length;
            dataBusTrip.forEach(dTrip => {
                totalRevenue += dTrip.totalPrice;
            })

            const resRevenue = Object.keys(revenueByMonth).map((month) => ({
                month: parseInt(month),
                totalTicket: revenueByMonth[month].totalTicket,
                totalRevenue: revenueByMonth[month].totalRevenue
            }))

            const dataBooking = await BusTrip.find({ createdAt: {
                $gte: startDate,
                $lt: endDate,
            }}).populate('busSchedule', 'route');

            let bookingReportObj = {};

            dataBooking.forEach(dBKing => {
                const route = dBKing.busSchedule?.route;
                if (!route) return;

                if (!bookingReportObj[route]) {
                    bookingReportObj[route] = {
                        tongChuyen: 0,
                        huyChuyen: 0,
                        doanhThuMat: 0,
                        lyDoHuy: [],
                        tiLeHuy: 0
                    };
                }

                bookingReportObj[route].tongChuyen += 1;

                if (dBKing.status === 'cancelled') {
                    bookingReportObj[route].huyChuyen += 1;
                    bookingReportObj[route].doanhThuMat += dBKing.totalPrice || 0;

                    if (dBKing.reasonCancel) {
                        bookingReportObj[route].lyDoHuy.push(...(Array.isArray(dBKing.reasonCancel) ? dBKing.reasonCancel : [dBKing.reasonCancel]));
                    }
                }

                bookingReportObj[route].tiLeHuy = (bookingReportObj[route].huyChuyen / bookingReportObj[route].tongChuyen) * 100;
            });

            const resBooking = Object.keys(bookingReportObj).map(route => ({
                route,
                tongChuyen: bookingReportObj[route].tongChuyen,
                huyChuyen: bookingReportObj[route].huyChuyen,
                doanhThuMat: bookingReportObj[route].doanhThuMat,
                lyDoHuy: bookingReportObj[route].lyDoHuy,
                tiLeHuy: bookingReportObj[route].tiLeHuy.toFixed(2)
            }));

            console.log(resBooking)


            let responseData = {
                revenueReport: {
                    totalRevenue: totalRevenue,
                    totalTicket: totalTicket,
                    detail: {}
                },
                percentCancelReport: {}
            }

            responseData.revenueReport.detail = resRevenue;
            responseData.percentCancelReport = resBooking;

            return responseData;
        }catch (e) {
            
        }
    }
}

module.exports = new ManageReportService();