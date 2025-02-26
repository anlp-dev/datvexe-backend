const express = require("express");
const router = express.Router();
const passport = require("passport");
const {inputValidationAccount, inputValidationLogin} = require("../../middleware/InputValidation");
const securityMiddleware = require("../../middleware/SecurityMiddleware");
const authContoller = require("../../controllers/auth/authController");
const Role = require("../../models/user/Role")
const Permission = require("../../models/user/Permission")
const RolePermission = require("../../models/user/RolePermission")
const {checkPermission} = require("../../middleware/AuthPermission");

// Đăng ký
router.post("/register", inputValidationAccount, authContoller.register);
// Đăng nhập
router.post("/login", inputValidationLogin, authContoller.login);

router.get("/profile/:id", authContoller.getDetailUser);

router.post("/permission/add", async(req, res) => {
    // const dataReq = {
    //     name: req.body.name,
    //     code: req.body.code,
    //     description: req.body.description,
    // }
    // const newPermission = new Permission(dataReq);
    // await newPermission.save();
    // res.json(newPermission)
    // const newRole = new Role({
    //     name: "Admin",
    //     code: "SUPER_ADMIN",
    //     description: "Super Admin"
    // })
    // await newRole.save();
    //
    // res.json(newRole);

    const newRolePermission = new RolePermission({
        roleId: "67be8368079a425e9e66e21c",
        permissionIds: "67be831192f94a626c4fe805"
    })
    await newRolePermission.save();
    res.json(newRolePermission);
})


module.exports = router;
