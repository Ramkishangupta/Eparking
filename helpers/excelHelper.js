const XLSX = require('xlsx');
const Slot = require('../models/Slot'); // Import the Slot model for database queries

// Helper function to save data to an Excel file
const saveToExcel = async () => {
    try {
        const slots = await Slot.find();

        // Map slot data to the required Excel format
        const data = slots.map(slot => ({
            SlotNumber: slot.slotNumber,
            Status: slot.status,
            CreatedAt: slot.createdAt ? slot.createdAt.toISOString() : 'N/A',
            UpdatedAt: slot.updatedAt ? slot.updatedAt.toISOString() : 'N/A',
        }));

        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Slots');

        // Save the workbook to an Excel file
        const filePath = './slots_data.xlsx';
        XLSX.writeFile(workbook, filePath);

        console.log('Data saved to Excel successfully:', filePath);
    } catch (error) {
        console.error('Error saving data to Excel:', error.message);
    }
};

module.exports = saveToExcel;
