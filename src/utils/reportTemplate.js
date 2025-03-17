function getTemplateReportInvoicePdf(datePay, bookingCode, customerName, route, paymentMethod, status, totalPrice){
    const htmlContent = `
                <html>
<head>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fff9f5;
            color: #333;
            font-size: 12px;
        }
        .invoice {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            padding: 15mm;
            box-sizing: border-box;
            background-color: white;
            position: relative;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #ffe0cc;
            padding-bottom: 15px;
        }
        .logo {
            font-size: 18px;
            font-weight: bold;
            color: #ff8c33;
            margin-bottom: 5px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
            color: #ff8c33;
            text-align: center;
        }
        .invoice-number {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
            text-align: center;
        }
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        .info-box {
            width: 48%;
            padding: 10px;
            background-color: #fff4eb;
            border-radius: 5px;
            border-left: 4px solid #ff8c33;
        }
        .info-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #ff8c33;
            font-size: 12px;
        }
        .info-content {
            margin-bottom: 5px;
            font-size: 12px;
        }
        .divider {
            height: 1px;
            background-color: #ffe0cc;
            margin: 15px 0;
        }
        .status {
            color: white;
            background-color: #ff8c33;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 12px;
            display: inline-block;
        }
        .total-section {
            text-align: right;
            padding: 10px 15px;
            background-color: #fff4eb;
            border-radius: 5px;
            margin-top: 15px;
        }
        .total-label {
            font-size: 14px;
            color: #666;
        }
        .total-amount {
            font-size: 16px;
            font-weight: bold;
            color: #ff7700;
            margin-top: 5px;
        }
        .footer {
            text-align: center;
            position: absolute;
            bottom: 15mm;
            left: 15mm;
            right: 15mm;
            font-size: 11px;
            color: #888;
            border-top: 1px solid #ffe0cc;
            padding-top: 10px;
        }
        .qr-section {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
        }
        .qr-code {
            width: 80px;
            height: 80px;
            background-color: #fff4eb;
            border: 1px solid #ffcc99;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #999;
        }
        .barcode {
            text-align: center;
            margin: 15px 0;
            padding: 8px;
            background-color: #fff9f5;
            border: 1px dashed #ffcc99;
        }
        .invoice-details {
            margin: 15px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        th {
            background-color: #fff4eb;
            text-align: left;
            padding: 8px;
            border: 1px solid #ffe0cc;
            font-size: 12px;
        }
        td {
            padding: 8px;
            border: 1px solid #ffe0cc;
            font-size: 12px;
        }
        .text-right {
            text-align: right;
        }
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            margin-bottom: 40px;
        }
        .signature-box {
            text-align: center;
            width: 45%;
        }
        .signature-title {
            font-weight: bold;
            margin-bottom: 50px;
        }
        @media print {
            body {
                background-color: white;
            }
            .invoice {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <div class="logo">CÔNG TY VẬN TẢI SAO VIET</div>
            <div>Địa chỉ: Lê Đức Thọ, Mai Dịch, Hà Nội</div>
            <div>Điện thoại: 039.865.3926 | MST: 0123456789</div>
        </div>
        
        <div class="title">HÓA ĐƠN</div>
        <div class="invoice-number">Số hóa đơn: INV-${bookingCode} | Ngày tạo: ${datePay}</div>
        
        <div class="info-section">
            <div class="info-box">
                <div class="info-title">THÔNG TIN KHÁCH HÀNG</div>
                <div class="info-content"><strong>Khách hàng:</strong> ${customerName}</div>
                <div class="info-content"><strong>Mã đặt vé:</strong> ${bookingCode}</div>
                <div class="info-content"><strong>Tuyến xe:</strong> ${route}</div>
            </div>
            
            <div class="info-box">
                <div class="info-title">THÔNG TIN THANH TOÁN</div>
                <div class="info-content"><strong>Ngày thanh toán:</strong> ${datePay}</div>
                <div class="info-content"><strong>Phương thức:</strong> ${paymentMethod}</div>
                <div class="info-content"><strong>Trạng thái:</strong> <span class="status">${getStatus(status)}</span></div>
            </div>
        </div>
        
        <div class="invoice-details">
            <table>
                <thead>
                    <tr>
                        <th width="5%">STT</th>
                        <th width="45%">Nội dung dịch vụ</th>
                        <th width="10%">Số lượng</th>
                        <th width="20%">Đơn giá</th>
                        <th width="20%">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Vé xe tuyến ${route}</td>
                        <td>1</td>
                        <td class="text-right">${formatCurrency(totalPrice)}</td>
                        <td class="text-right">${formatCurrency(totalPrice)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="text-right"><strong>Tổng cộng:</strong></td>
                        <td class="text-right"><strong>${formatCurrency(totalPrice)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="barcode">
            Mã tra cứu: ${bookingCode}${datePay.replace(/[\/\s:]/g, '')}
        </div>
        
        <div class="footer">
            <p>Hóa đơn điện tử này có giá trị pháp lý như hóa đơn giấy</p>
            <p>Để kiểm tra tính hợp lệ của hóa đơn, vui lòng truy cập website: www.xyz-transport.com.vn/invoice</p>
        </div>
    </div>
</body>
</html>
            `;
    return htmlContent
}

function getStatus(status){
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

function formatCurrency(amount, currency = 'VND', locale = 'vi-VN') {
    if (isNaN(amount)) return amount * 1000;
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount * 1000);
};

module.exports = {getTemplateReportInvoicePdf}