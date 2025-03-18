const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    amount: Number,
    description: String,
    qrCode: String,
    status: { type: String, default: "pending" }, // 'pending' | 'paid'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
