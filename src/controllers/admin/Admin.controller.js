const {resExport} = require("../../enums/resExport");
const AdminService = require("../../services/admin/Admin.service")
const ManageUserService = require("../../services/admin/ManageUser.service")
const ManageTicketService = require("../../services/admin/ManageTicket.service")
const ManageBusService = require("../../services/admin/ManageBus.service")
const ManagePaymentService = require("../../services/admin/ManagePayment.service")
const ManageReportService = require("../../services/admin/ManageReport.service")
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


    async getDiscount(req, res){
        try{
            const resData = await AdminService.getAllDiscount();
            resExport(200, "Thành công", resData, res)
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async createDiscount(req, res){
        try{
            const resData = await AdminService.addNewDisCount(req.body);
            resExport(200, "Thành công", resData, res)
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async updateDiscount(req, res){
        try{
            const resData = await AdminService.updateDiscount(req.body);
            resExport(200, "Thành công", resData, res)
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async deleteDiscount(req, res){
        try{
            const resData = await AdminService.deleteDiscount(req.params.id);
            resExport(200, "Thành công", resData, res)
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getUserByAdmin(req, res){
        try{
            const resData = await ManageUserService.getAllUser();
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res)
        }
    }

    async addUserByAdmin(req, res){
        try{
            const resData = await ManageUserService.addNewUser(req.body);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async updateUserByAdmin(req, res){
        try{
            const resData = await ManageUserService.updateUser(req.body);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async deleteUserByAdmin(req, res){
        try{
            const resData = await ManageUserService.deleteUser(req.params.id);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getTicketByAdmin(req, res){
        try{
            const resData = await ManageTicketService.getAllTicketByAdmin();
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }


    async getAllBusByAdmin(req, res){
        try{
            const resData = await ManageBusService.getAllBus();
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getAllPaymentByAdmin(req, res){
        try{
            const resData = await ManagePaymentService.getAllPayment();
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async exportPdfPayment(req, res){
        try{
            const pdfPath = await ManagePaymentService.exportPdf(req.body);
            res.download(pdfPath, 'receipt.pdf')
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }


    async getReport(req, res){
        try{
            const resData = await ManageReportService.getDoanhThu(req.query.year)
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new AdminController();