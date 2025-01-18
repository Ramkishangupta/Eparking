const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    slotNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ['unoccupied', 'occupied'], default: 'unoccupied' },
}, { timestamps: true }); 


module.exports = mongoose.model('Slot', slotSchema);
