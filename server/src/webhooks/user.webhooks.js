const { Webhook } = require('svix');
const User = require('../models/User');

const clerkWebhook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error('CLERK_WEBHOOK_SECRET is not set');
        return res.status(400).json({ error: 'Webhook secret is not set' });
    }

    // Get the headers and body
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: 'Missing svix headers' });
    }

    const payload = req.body;
    const body = payload.toString();

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('Webhook verification failed', err.message);
        return res.status(400).json({ error: 'Verification failed' });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook received: ${eventType}`);

    try {
        if (eventType === 'user.created' || eventType === 'user.updated') {
            const { first_name, last_name, image_url, email_addresses, username } = evt.data;
            const email = email_addresses[0]?.email_address;

            await User.findOneAndUpdate(
                { clerkId: id },
                {
                    clerkId: id,
                    firstName: first_name,
                    lastName: last_name,
                    profileImageUrl: image_url,
                    email: email,
                    username: username,
                },
                { upsert: true, new: true }
            );
            console.log(`User ${id} saved/updated in MongoDB.`);
        }

        if (eventType === 'user.deleted') {
            await User.findOneAndDelete({ clerkId: id });
            console.log(`User ${id} deleted from MongoDB.`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error processing webhook event', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = clerkWebhook;
