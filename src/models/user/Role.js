const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Role = new Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, default: "" }, // Mô tả vai trò (optional)
    color: {type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null }
});

module.exports = mongoose.model("Role", Role, "roles");
