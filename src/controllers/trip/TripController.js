const TripService = require('../../services/trip/TripService');
const {resExport} = require("../../enums/resExport");

class TripController{
    async loadDiaDiem(req, res){
        try{
            const resData = await TripService.getAllTrip();
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new TripController();