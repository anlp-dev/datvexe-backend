const mongoose = require('mongoose');
const User = require("../models/user/User");
const Role = require("../models/user/Role");
const RolePermission = require("../models/user/RolePermission");
const Permission = require("../models/user/Permission");
require('dotenv').config()
async function connect(){
  try {
    await mongoose.connect(process.env.URL_DB_DEV);
    console.log("Kết nối cơ sở dữ liệu thành công !!!")
  } catch (error) {
    console.log('Kết nối cơ sở dữ liệu thất bại!!!');
  }
}

async function getPermissionsForUser(userId) {
  try {
    const account = await User.findById(userId);
    if (!account) {
      console.warn(`Không tìm thấy user với ID: ${userId}`);
      return [];
    }

    const rolePermission = await RolePermission.findOne({ roleId: account.roleId });
    if (!rolePermission || !rolePermission.permissionIds || rolePermission.permissionIds.length === 0) {
      console.warn(`Không tìm thấy quyền cho roleId: ${account.roleId}`);
      return [];
    }

    const permissions = await Permission.find({ _id: { $in: rolePermission.permissionIds } });

    return permissions.map(p => p.code);
  } catch (error) {
    console.error('Lỗi khi lấy quyền:', error);
    return [];
  }
}


module.exports = {connect, getPermissionsForUser};
