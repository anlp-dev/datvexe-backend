const {resExport} = require("../../enums/resExport");
const manageService = require("../../services/manage/Manage.service");
const MESSAGE = require("../../enums/statusMsg");
class ManageController{
    async getScheduleByManage(req, res){
        try{
            const resData = await manageService.getAllSchedule();
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res)
        }
    }

    async getScheduleByAdmin(req, res){
        try{
            const resData = await manageService.getAllScheduleByAdmin();
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res)
        }
    }

    async updateScheduleStatusByAdminAndManage(req, res){
        try{
            const resData = await manageService.updateStatusBusSchedule(req.body);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res)
        }
    }

    async cancelScheduleByAdminAndManage(req, res){
        try{
            const resData = await manageService.cancelBusScheduleByAdmin(req.params.id);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res)
        }
    }

    async generate(req, res){
        try{
            const resData = await manageService.generateTrip(req.body);
            resExport(MESSAGE.SUCCESS.status, MESSAGE.SUCCESS.msg, resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new ManageController();