const BusTrip = require("../../models/trip/BusTrip");
const User = require("../../models/user/User")
const BusSchedule = require("../../models/trip/BuSchedule")

class ManageTicketService {
    async getAllTicketByAdmin(){
        try{
            const dataBusTrip = await BusTrip.find({}).populate("user", "fullname email phone").populate("busSchedule").lean();
            if(dataBusTrip.length < 1) throw new Error("Không tìm thấy dữ liệu đặt vé !");
            console.log(dataBusTrip)
            return dataBusTrip;
        }catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new ManageTicketService();