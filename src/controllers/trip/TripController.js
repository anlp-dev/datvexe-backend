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

    async getScheduleById(req, res){
        try{
            const resData = await TripService.getScheduleById(req.params.id);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async loadSchedule(req, res){
        try{
            const resData = await TripService.loadBusSchedule(req.body);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async createTrip(req, res){
        try{
            const resData = await TripService.createBusTrip(req.body);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new TripController();