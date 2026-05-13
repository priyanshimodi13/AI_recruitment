const express = require('express');
const { requireAuth } = require('../middlewares/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const notifications = await Notification.find({ recipient: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark a notification as read
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    res.json({ notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark all notifications as read
router.patch('/read-all', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    await Notification.updateMany(
      { recipient: user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a notification
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: user._id
    });

    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
