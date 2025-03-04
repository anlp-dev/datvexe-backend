const express = require("express");
const router = express.Router();
const {checkPermission} = require("../../middleware/AuthPermission");
const notificeController = require("../../controllers/system/NotificeController");

router.get("/:id/get", notificeController.getNotifice);

module.exports = router;