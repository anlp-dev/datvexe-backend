const {resExport} = require("../../enums/resExport");
const notificeService = require("../../services/system/NotificeService");
class NotificeController {
    async getNotifice(req, res){
        try{
            const resData = await notificeService.getNotificeById(req.params.id);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new NotificeController();