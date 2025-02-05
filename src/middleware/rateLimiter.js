const geoip = require("geoip-lite");
const os = require("os"); // Module để lấy thông tin hệ thống
const RequestLog = require("../models/admin/Log");

const logRequest = async (req, res, next) => {
  // Lấy IP từ request
  const ip =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Tra cứu thông tin địa lý từ IP
  const geo = geoip.lookup(ip);

  // Lấy thông tin tên máy
  const hostname = req.hostname; // Hoặc gửi từ client để chính xác từ máy người dùng

  // Giả lập tên user đăng nhập từ hệ thống xác thực
  const user = req.user ? req.user.username : "Anonymous"; // Dựa vào hệ thống auth (JWT, session, etc.)

  const log = new RequestLog({
    timestamp: new Date(),
    ip,
    location: geo,
    hostname,
    user,
    endpoint: req.originalUrl,
    method: req.method,
  });

  try {
    await log.save();
  } catch (err) {
    console.error("Error saving log:", err);
  }

  next(); // Tiếp tục xử lý request
};

module.exports = { logRequest };
