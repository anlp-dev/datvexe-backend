const {resExport} = require("../../enums/resExport");
const AdminService = require("../../services/admin/AdminService")

class AdminController {
    async getRole (req, res){
        try{
            const resData = await AdminService.getAllRole();
            resExport(200, "Thành công", resData, res)
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async createRole (req, res){
        try{
            const resData = await AdminService.createRole(req.body);
            resExport(200, "Thành công", resData, res)
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async updateRole (req, res){
        try{
            const resData = await AdminService.updateRole(req.body);
            resExport(200, "Thành công", resData, res)
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getRolePermission (req, res){
        try{
            const resData = await AdminService.getRolePermission();
            resExport(200, "Thành công", resData, res)
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async updateRolePermission (req, res){
        try{
            const resData = await AdminService.updateRolePermission(req.body);
            resExport(200, "Thành công", resData, res)
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getPermission (req, res){
        try{
            const resData = await AdminService.getAllPermission();
            resExport(200, "Thành công", resData, res)
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async createPermission(req, res){
        try{
            const resData = await AdminService.createPermission(req.body);
            resExport(200, "Thành công", resData, res)
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new AdminController();