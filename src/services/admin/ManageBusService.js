const BusOperator = require("../../models/bus/BusOperators");
const TypeBus = require("../../models/bus/TypeBus");

class ManageBusService {
    async getAllBus() {
        try{
            const dataBus = await BusOperator.find({}).populate("types");
            if(!dataBus){
                throw new Error("Không tìm thấy dữ liệu !");
            }
            return dataBus;
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new ManageBusService();