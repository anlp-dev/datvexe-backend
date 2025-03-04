const express = require("express");
const router = express.Router();
const SystemController = require("../../controllers/system/SystemController");
const {checkPermission} = require("../../middleware/AuthPermission");

router.get("/logRequest/get", SystemController.getAllLogRequest);

module.exports = router;