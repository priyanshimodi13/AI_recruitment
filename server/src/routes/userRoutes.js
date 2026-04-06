const express = require('express');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const userId = req.auth.userId; // Clerk user ID
        const User = require('../models/User');
        let user = await User.findOne({ clerkId: userId });
        
        // Auto-sync user if they don't exist in MongoDB (e.g. if webhook wasn't received locally)
        if (!user) {
            const clerk = require('@clerk/clerk-sdk-node');
            const clerkUser = await clerk.users.getUser(userId);
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            
            // Auto-assign admin if email matches user's email or contains "admin"
            const isAdmin = email && (email === 'pryanshineweb.ai@gmail.com' || email.toLowerCase().includes('admin'));
            
            user = await User.create({
                clerkId: userId,
                email: email,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
                profileImageUrl: clerkUser.imageUrl,
                username: clerkUser.username,
                isAdmin: isAdmin || false // Allow manual override in DB later
            });
            console.log(`Auto-synced user to DB: ${email}. Admin status: ${isAdmin}`);
        }
        
        res.json({ 
            message: 'Protected user data', 
            userId,
            isAdmin: user.isAdmin,
            user: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
