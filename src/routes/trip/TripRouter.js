const express = require("express");
const router = express.Router();
const TripController = require("../../controllers/trip/TripController");
const TypeBus = require("../../models/bus/TypeBus");

router.get("/location/all", TripController.loadDiaDiem);

router.post("/themLoaiXe", async (req, res) => {
    const { name, code, seats, features, description } = req.body;
    const typeBus = new TypeBus({ name, code, seats, features, description });
    await typeBus.save();
    res.json(await TypeBus.find({}));
})


// router.get("/create/LocationTrip", async (req, res) => {
//     const locationTrip = await LocationTrip.find({}).populate("benXe");
//     res.json(locationTrip);
// })

module.exports = router;