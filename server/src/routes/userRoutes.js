const express = require('express');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const userId = req.auth.userId; // Clerk user ID
        const User = require('../models/User');
        const user = await User.findOne({ clerkId: userId });
        
        res.json({ 
            message: 'Protected user data', 
            userId,
            isAdmin: user ? user.isAdmin : false
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
