const LogRequest = require('../../models/system/LogRequest');
class SystemService {
    async getLogRequest(){
        try{
            const logRequestList = await LogRequest.find({});
            if(logRequestList.length < 1) throw new Error("Không tìm thấy request !")
            return logRequestList;
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new SystemService();