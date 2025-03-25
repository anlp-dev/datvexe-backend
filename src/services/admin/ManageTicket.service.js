const BusTrip = require("../../models/trip/BusTrip.model");
const User = require("../../models/user/User.model")
const BusSchedule = require("../../models/trip/BuSchedule.model")

class ManageTicketService {
    async getAllTicketByAdmin(){
        try{
            const dataBusTrip = await BusTrip.find({}).populate("user", "fullname email phone").populate("busSchedule").sort({ createdAt: -1 }).lean();
            if(dataBusTrip.length < 1) throw new Error("Không tìm thấy dữ liệu đặt vé !");
            return dataBusTrip;
        }catch (e) {
            throw new Error(e);
        }
    }


    async changeStatusTicket(dataReq){
        try{
            const {id, status} = dataReq;
            const dataTicket = await BusTrip.findById(id);
            if(!dataTicket) throw new Error("Không tìm thấy vé !")
            dataTicket.status = status;
            await dataTicket.save();
            return dataTicket
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new ManageTicketService();