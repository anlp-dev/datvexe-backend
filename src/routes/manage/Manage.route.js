const express = require("express");
const router = express.Router();
const manageController = require("../../controllers/manage/Manage.controller");
const {checkPermission} = require("../../middleware/AuthPermission");

router.get("/busSchedule", manageController.getScheduleByManage);
router.get("/busSchedule/admin", checkPermission("CRUD_BUS_SCHEDULE"), manageController.getScheduleByAdmin)
router.post("/busSchedule/generate", checkPermission("CRUD_BUS_SCHEDULE"), manageController.generate);
router.post("/busSchedule/update", manageController.updateScheduleStatusByAdminAndManage);
router.delete("/busSchedule/:id", manageController.cancelScheduleByAdminAndManage);

module.exports = router;