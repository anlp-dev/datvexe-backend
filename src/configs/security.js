const path = require("path");
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const secret = require("./secrets");
const authMiddleware = require("../middleware/authMiddleware");

const security = (app) => {
  // Middleware xử lý JSON body
  app.use(express.json());

  // Middleware xử lý urlencoded body (dành cho form data)
  app.use(express.urlencoded({ extended: true }));

  // Sử dụng express-session
  app.use(
    session({
      secret: secret.JWT_SECRET_KEY, // Thay bằng một chuỗi bí mật
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false,
        maxAge: 60 * 60 * 1000, // 1 tieng
      }, // Đặt secure: true nếu sử dụng HTTPS
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // cac routes phai co token moi co the truy cap duoc
  app.use((req, res, next) => {
    const noAuthPaths = ["/auth/login", "/auth/register", "/api-docs", "/role/", "/email/", "/system/log", "/favicon.ico", "/auth/config/password"];
    if (noAuthPaths.includes(req.path) || req.path.startsWith("/email/verify/")) {
      next();
    } else {
      authMiddleware(req, res, next);
    }
  });
};

module.exports = security;
