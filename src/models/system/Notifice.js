const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notifice = new Schema({
    type: {type: String}, // Loại thông báo,
    title: { type: String}, // Tiêu đề thông báo
    message: {type: String},
    tab: {type: String, required: true, default: "events"},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Người nhận thông báo
    createdAt: { type: Date, default: Date.now }, // Thời gian request
});

module.exports = mongoose.model("Notifice", Notifice, "notifice");
