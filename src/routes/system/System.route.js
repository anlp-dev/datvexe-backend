const express = require("express");
const router = express.Router();
const SystemController = require("../../controllers/system/System.controller");
const {checkPermission} = require("../../middleware/AuthPermission");

router.get("/logRequest/get", SystemController.getAllLogRequest);

module.exports = router;