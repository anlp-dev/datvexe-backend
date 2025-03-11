const express = require("express");
const router = express.Router();
const manageController = require("../../controllers/manage/ManageController");

router.get("/busSchedule", manageController.getScheduleByManage);

module.exports = router;