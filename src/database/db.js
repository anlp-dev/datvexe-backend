const mongoose = require('mongoose');
const Account = require('../models/accounts/Account');
const RolePermission = require('../models/accounts/RolePermission');
const Permission = require('../models/accounts/Permission');
require('dotenv').config()
async function connect(){
  try {
    if(process.env.NODE_ENV === 'prod'){
      await mongoose.connect(process.env.URL_DB_PRODUCTION);
      console.log('Connect successfuly mode production!!!');
    }else {
      await mongoose.connect(process.env.URL_DB);
      console.log('Connect successfuly mode dev!!!');

    }
  } catch (error) {
    console.log('connect fail!!!');
  }
}

async function getPermissionsForUser(userId){
  try {
    const account = await Account.findById(userId);
    if(!account){
      return [];
    }
    const rolePermission = await RolePermission.findOne({ roleId: account.roleId }).populate('roleId');
    const permissionId = rolePermission.permissionIds.flat();
    const objectIds = permissionId.map(p => mongoose.Types.ObjectId(p));
    const permissions = await Permission.find({ _id: { $in: objectIds } });
    rolePermission.permissionIds = permissions;
    return permissions.map(p => p.code);
  } catch (error) {
    console.error('Lỗi khi lấy quyền:', error);
    return [];
  }
}

module.exports = {connect, getPermissionsForUser};
