const express = require("express");
const router = express.Router();
const {checkPermission} = require("../../middleware/AuthPermission");
const notificeController = require("../../controllers/system/Notifice.controller");

router.get("/:id/get", notificeController.getNotifice);

module.exports = router;