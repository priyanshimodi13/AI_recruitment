require('dotenv').config({ path: './config.env' });
const { createClerkClient } = require('@clerk/clerk-sdk-node');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function deleteUserByEmail(email) {
  try {
    console.log(`Searching for user with email: ${email}...`);
    
    // List all users to find the one with the matching email
    const users = await clerkClient.users.getUserList({
      emailAddress: [email]
    });

    if (users.length === 0) {
      console.log(`No user found with email: ${email}`);
      return;
    }

    const userId = users[0].id;
    console.log(`Found user: ${userId}. Deleting...`);

    await clerkClient.users.deleteUser(userId);
    
    console.log(`Successfully deleted user ${email} from Clerk!`);
  } catch (err) {
    console.error('Error deleting user:', err);
  }
}

const targetEmail = 'modipriyanshi013@gmail.com';
deleteUserByEmail(targetEmail);
