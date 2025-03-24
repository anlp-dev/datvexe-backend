const {resExport} = require("../../enums/resExport");
const authService = require("../../services/auth/auth.service");

class authController {
    async register(req, res){
        try{
            const res_data = await authService.createUser(req.body);
            resExport(200, "Đăng kí tài khoản thành công.", res_data, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async login(req, res){
        try{
            const res_data = await authService.login(req.body);
            resExport(200, "Đăng nhập thành công !", res_data, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getDetailUser(req, res){
        try{
            const res_data = await authService.getUserByID(req.params.id);
            resExport(200, "Lấy thông tin người dùng thành công", res_data, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async updateProfileUser(req, res){
        try{
            const res_data = await authService.updateProfileUserById(req.params.id, req.body);
            resExport(200, "Cap nhat thong tin nguoi dung thanh cong", res_data, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async updateStatusUser(req, res){
        try{
            const res_data = await authService.updateStatusUser(req.params.id);
            if(res_data){
                res.send("Kích hoạt tài khoản thành công!");
            }
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async changePassworldUser(req, res){
        try{
            const res_data = await authService.changePassword(req.account.userId, req.body);
            resExport(200, "Thành công", res_data, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new authController();
