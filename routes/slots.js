const express = require('express');
const Slot = require('../models/Slot');
const saveToExcel = require('../helpers/excelHelper'); 
const router = express.Router();

// Get all parking slots
router.get('/', async (req, res) => {
    try {
        const slots = await Slot.find();
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a slot's status
router.post('/update', async (req, res) => {
    const { slotNumber, status } = req.body;

    try {
        if (!['unoccupied', 'occupied'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const slot = await Slot.findOneAndUpdate(
            { slotNumber },
            { status },
            { new: true, runValidators: true }
        );

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        // Save the updated data to Excel
        await saveToExcel();

        res.status(200).json({ message: `Slot ${slotNumber} updated to ${status}`, slot });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new parking slot
router.post('/add', async (req, res) => {
    const { slotNumber } = req.body;

    try {
        const existingSlot = await Slot.findOne({ slotNumber });
        if (existingSlot) {
            return res.status(400).json({ message: 'Slot already exists' });
        }

        const newSlot = new Slot({ slotNumber });
        await newSlot.save();

        // Save the new data to Excel
        await saveToExcel();

        res.status(201).json({ message: 'Slot added successfully', slot: newSlot });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
