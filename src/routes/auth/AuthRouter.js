const express = require("express");
const router = express.Router();
const passport = require("passport");
const {inputValidationAccount, inputValidationLogin} = require("../../middleware/InputValidation");
const securityMiddleware = require("../../middleware/SecurityMiddleware");
const authContoller = require("../../controllers/auth/authController");
const Role = require("../../models/user/Role")

// Đăng ký
router.post("/register", inputValidationAccount, authContoller.register);
// Đăng nhập
router.post("/login", inputValidationLogin, authContoller.login);

router.get("/profile/:id", authContoller.getDetailUser);


module.exports = router;
