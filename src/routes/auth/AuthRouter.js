const express = require("express");
const router = express.Router();
const { inputValidationAccount, inputValidationLogin } = require("../../middleware/InputValidation");
const authContoller = require("../../controllers/auth/authController");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API xác thực người dùng
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newuser"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 */
router.post("/register", inputValidationAccount, authContoller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập và nhận token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user"
 *               password:
 *                 type: string
 *                 example: "123456"
 */
router.post("/login", inputValidationLogin, authContoller.login);

/**
 * @swagger
 * /auth/profile/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 */
router.get("/profile/:id", authContoller.getDetailUser);

module.exports = router;
