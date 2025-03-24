const Notifice = require("../../models/system/Notifice.model");

class NotificeService {
    async getNotificeById(dataReq){
        try{
            const notificeRes = await Notifice.find({user: dataReq}).populate('user').sort({createdAt: -1}).lean();
            if(!notificeRes) throw new Error("Không tìm thấy thông báo !");
            return notificeRes;
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new NotificeService();