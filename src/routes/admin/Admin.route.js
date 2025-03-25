const express = require("express");
const router = express.Router();
const AdminController = require("../../controllers/admin/Admin.controller");
const {checkPermission} = require("../../middleware/AuthPermission");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API dành cho quản trị viên
 */

/**
 * @swagger
 * /admin/role:
 *   get:
 *     summary: Lấy danh sách vai trò (roles)
 *     tags: [Admin]
 */
router.get("/role", AdminController.getRole);
/**
 * @swagger
 * /admin/role:
 *   post:
 *     summary: Thêm mới vai vai trò (roles)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "user"
 *               code:
 *                 type: string
 *                 example: "ROLE_CODE"
 *               description:
 *                  type: string
 *                  example: "description"
 *               color:
 *                  type: string
 *                  example: "#ff0000"
 */
router.post("/role", AdminController.createRole);
/**
 * @swagger
 * /admin/role:
 *   put:
 *     summary: Cập nhật vai vai trò (roles)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "user"
 *               description:
 *                  type: string
 *                  example: "description"
 *               color:
 *                  type: string
 *                  example: "#ff0000"
 */
router.put("/role", AdminController.updateRole);

/**
 * @swagger
 * /admin/permission:
 *   get:
 *     summary: Lấy danh sách quyền (permissions)
 *     tags: [Admin]
 */
router.get("/permission", AdminController.getPermission);

/**
 * @swagger
 * /admin/permission:
 *   post:
 *     summary: Thêm mới vai quyền (permission)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "user can do something"
 *               code:
 *                 type: string
 *                 example: "PERMISSION_CODE"
 *               description:
 *                  type: string
 *                  example: "description"
 */
router.post("/permission", AdminController.createPermission);

/**
 * @swagger
 * /admin/rolePermission:
 *   get:
 *     summary: Lấy danh sách quyền theo vai trò (role-permissions)
 *     tags: [Admin]
 */
router.get("/rolePermission", AdminController.getRolePermission);

/**
 * @swagger
 * /admin/rolePermission:
 *   put:
 *     summary: Cập nhật quyền cho từng role (role_permission)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "7671DWA((**&...."
 *               permissions:
 *                 type: array
 *                 example: ["PERMISSION_CODE_1", "PERMISSION_CODE_2"]
 */
router.put("/rolePermission", AdminController.updateRolePermission);

// manage discount
router
    .get("/discount", AdminController.getDiscount)
    .post("/discount", AdminController.createDiscount)
    .put("/discount", AdminController.updateDiscount)
    .delete("/discount/:id", AdminController.deleteDiscount);
// manage user
router
    .get("/users", AdminController.getUserByAdmin)
    .post("/users", AdminController.addUserByAdmin)
    .put("/users", AdminController.updateUserByAdmin)
    .delete("/users/:id", AdminController.deleteUserByAdmin)
// manage ticket
router.get("/ticket", AdminController.getTicketByAdmin)
    .put("/ticket", AdminController.updateTicketByAdmin);

// manage bus
router
    .get("/bus", AdminController.getAllBusByAdmin);

// manage payment
router
    .get("/payment", AdminController.getAllPaymentByAdmin)
    .post("/payment/download-pdf", AdminController.exportPdfPayment);

// manage report
router
    .get("/reports", AdminController.getReport);


module.exports = router;
