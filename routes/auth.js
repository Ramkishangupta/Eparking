const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    const { name, dept, id, password, phone, email } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ id });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, dept, id, password: hashedPassword, phone, email });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { id, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token,id,message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

router.post('/details', async (req, res) => {
    const { id } = req.body; // Expecting id in the body of the request

    try {
        // Fetch user details by id
        const user = await User.findOne({ id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Exclude password from the response
        const { password, ...userDetails } = user._doc;

        res.status(200).json(userDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error });
    }
});


module.exports = router;
