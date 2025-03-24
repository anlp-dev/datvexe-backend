const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailService {
  async sendEmailActiveUser(data) {
    try {
      const { to, subject, text } = data;
      
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error("Missing email configuration in environment variables");
        return false;
      }
      
      console.log("Creating transporter with credentials...");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      console.log("Preparing email to send to:", to);
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f7;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
                      <!-- Header with logo -->
                      <div style="background-color: #FF8C00; padding: 30px 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 1px;">BookingCar - Sao Việt</h1>
                        <div style="background-color: white; width: 60px; height: 4px; margin: 15px auto;"></div>
                        <p style="color: white; margin: 0; font-size: 18px;">Xác Nhận Tài Khoản</p>
                      </div>
                      
                      <!-- Content -->
                      <div style="padding: 40px 30px; color: #444444;">
                        <h2 style="color: #FF8C00; margin-top: 0; font-size: 24px; border-bottom: 2px solid #FFE0B2; padding-bottom: 10px;">Chào Mừng Bạn!</h2>
                        
                        <p style="font-size: 16px; line-height: 1.6;">Cảm ơn bạn đã đăng ký tài khoản tại <strong style="color: #FF8C00;">BookingCar - Sao Việt</strong>. Chúng tôi rất vui mừng được chào đón bạn!</p>
                        
                        <p style="font-size: 16px; line-height: 1.6;">Để hoàn tất quá trình đăng ký và kích hoạt tài khoản của bạn, vui lòng nhấp vào nút bên dưới:</p>
                        
                        <div style="text-align: center; margin: 35px 0;">
                          <a href="${text}" style="display: inline-block; background: linear-gradient(to right, #FF8C00, #FFA500); color: white; padding: 14px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(255,140,0,0.3); transition: all 0.3s;">KÍCH HOẠT TÀI KHOẢN</a>
                        </div>
                        
                        <div style="background-color: #FFF8E1; border-left: 4px solid #FF8C00; padding: 15px; margin: 20px 0; border-radius: 4px;">
                          <p style="margin: 0; font-size: 14px; color: #666;">Nếu bạn không thể nhấp vào nút, vui lòng sao chép và dán liên kết sau vào trình duyệt của bạn:</p>
                          <p style="margin: 10px 0 0 0; word-break: break-all; font-size: 14px; color: #FF8C00;">${text}</p>
                        </div>
                        
                        <p style="font-size: 14px; color: #666; font-style: italic;">Lưu ý: Liên kết này sẽ hết hạn sau 24 giờ kể từ khi bạn nhận được email này.</p>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                          <p style="font-size: 16px; margin: 0 0 15px 0;">Cần hỗ trợ? Chúng tôi luôn sẵn sàng giúp đỡ!</p>
                          <p style="margin: 0; font-size: 14px; color: #666;">
                            <strong style="color: #FF8C00;">Email:</strong> anlp.sep19@gmail.com<br>
                            <strong style="color: #FF8C00;">Hotline:</strong> 0398653926
                          </p>
                        </div>
                      </div>
                      
                      <!-- Footer -->
                      <div style="background-color: #333333; color: white; padding: 20px; text-align: center;">
                        <p style="margin: 0 0 10px 0; font-size: 14px;">© ${new Date().getFullYear()} BookingCar - Sao Việt. Tất cả các quyền được bảo lưu.</p>
                        <div style="margin: 15px 0;">
                          <a href="#" style="display: inline-block; margin: 0 10px; color: white; text-decoration: none; font-size: 13px;">Điều khoản sử dụng</a>
                          <a href="#" style="display: inline-block; margin: 0 10px; color: white; text-decoration: none; font-size: 13px;">Chính sách bảo mật</a>
                          <a href="#" style="display: inline-block; margin: 0 10px; color: white; text-decoration: none; font-size: 13px;">Liên hệ</a>
                        </div>
                        <div style="margin-top: 15px; font-size: 12px; color: #aaa;">
                          Email này được gửi tự động. Vui lòng không trả lời email này.
                        </div>
                      </div>
                    </div>
                  </body>
                  </html>
              `,
      };

      console.log("Sending email...");
      const result = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", result.messageId);
      return true;
    } catch (e) {
      console.error("Error sending email:", e);
      return false;
    }
  }
}

module.exports = new EmailService();
