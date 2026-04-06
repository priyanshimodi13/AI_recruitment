import express from 'express'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/profile', requireAuth, (req, res) => {
    const userId = req.auth.userId  // Clerk user ID
    res.json({ message: 'Protected data', userId })
})

export default router