const LocationTrip = require("../../models/trip/LocationTrip");
const BusStation = require("../../models/trip/BusStation");

class TripService {
    async getAllTrip() {
        try{
            const location = await LocationTrip.find({}).populate("benXe");
            return location;
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new TripService();