const express = require("express");
const router = express.Router();
const passport = require("passport");
const {inputValidationAccount, inputValidationLogin} = require("../../middleware/inputValidation");
const securityMiddleware = require("../../middleware/securityMiddleware");
const authContoller = require("../../controllers/auth/authController");

// Đăng ký
router.post("/register", inputValidationAccount, authContoller.register);
// Đăng nhập
router.post("/login", inputValidationLogin, authContoller.login);


module.exports = router;
