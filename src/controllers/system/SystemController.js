const {resExport} = require("../../enums/resExport");
const SystemService = require("../../services/system/SystemService");
class SystemController {
    async getAllLogRequest(req, res){
        try{
            const resData = await SystemService.getLogRequest();
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new SystemController();