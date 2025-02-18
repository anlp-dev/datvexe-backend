const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationTripSchema = new Schema({
    maTinh: {type: String, required: true},
    tenTinh: {type: String, required: true, options: ["Hà Nội", "Lào Cai"]},
    benXe: [{type: mongoose.Schema.Types.ObjectId, ref: "BusStation", required: true}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},
    deletedAt: {type: Date},
})

module.exports = mongoose.model('LocationTrip', LocationTripSchema, 'location_trip');