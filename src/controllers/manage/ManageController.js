const {resExport} = require("../../enums/resExport");
const manageService = require("../../services/manage/ManageService");
class ManageController{
    async getScheduleByManage(req, res){
        try{
            const resData = await manageService.getAllSchedule();
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res)
        }
    }
}

module.exports = new ManageController();