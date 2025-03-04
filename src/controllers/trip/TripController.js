const TripService = require('../../services/trip/TripService');
const {resExport} = require("../../enums/resExport");
const MESSAGE = require("../../enums/statusMsg");

class TripController{
    async loadDiaDiem(req, res){
        try{
            const resData = await TripService.getAllTrip();
            resExport(MESSAGE.SUCCESS.status, MESSAGE.SUCCESS.msg, resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getScheduleById(req, res){
        try{
            const resData = await TripService.getScheduleById(req.params.id);
            resExport(MESSAGE.SUCCESS.status, MESSAGE.SUCCESS.msg, resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async loadSchedule(req, res){
        try{
            const resData = await TripService.loadBusSchedule(req.body);
            resExport(MESSAGE.SUCCESS.status, MESSAGE.SUCCESS.msg, resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async createTrip(req, res){
        try{
            const resData = await TripService.createBusTrip(req.body);
            resExport(MESSAGE.SUCCESS.status, MESSAGE.SUCCESS.msg, resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async generate(req, res){
        try{
            const resData = await TripService.generateTrip(req.body);
            resExport(MESSAGE.SUCCESS.status, MESSAGE.SUCCESS.msg, resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new TripController();