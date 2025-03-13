const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    percent: { type: Number, required: true, min: 0, max: 100 },
    quantity: { type: Number, default: 0, min: 0 },
    status: { type: String, default: "01" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
});

module.exports = mongoose.model("Discount", DiscountSchema, "discounts");
