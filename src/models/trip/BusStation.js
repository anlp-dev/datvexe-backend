const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusStationSchema = new Schema({
    maBenXe: {type: String, required: true},
    tenBenXe: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},
    deletedAt: {type: Date},
})

module.exports = mongoose.model('BusStation', BusStationSchema, 'bus_station');