const Notification = require('../models/Notification');

/**
 * Create a new notification
 * @param {Object} params - Notification parameters
 * @param {string} params.recipient - User ID of the recipient
 * @param {string} [params.sender] - User ID of the sender
 * @param {string} params.type - Notification type
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} [params.relatedId] - ID of the related object
 * @param {string} [params.relatedModel] - Model name of the related object
 */
const createNotification = async ({ recipient, sender, type, title, message, relatedId, relatedModel }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      relatedId,
      relatedModel
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // We don't throw here to avoid breaking the main flow if notification fails
  }
};

module.exports = { createNotification };
