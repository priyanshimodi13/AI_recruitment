/**
 * Run this script once to set isAdmin: true for your account.
 * Usage: node src/scripts/makeAdmin.js your@email.com
 *
 * Example: node src/scripts/makeAdmin.js priyanshi@gmail.com
 */

require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');

const email = process.argv[2];

if (!email) {
  console.error('❌  Please provide an email address.');
  console.error('    Usage: node src/scripts/makeAdmin.js your@email.com');
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('✅  Connected to MongoDB');

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌  No user found with email: ${email}`);
      console.log('\n📋  All users in the database:');
      const all = await User.find({}, 'email isAdmin');
      all.forEach((u) => console.log(`    - ${u.email}  (isAdmin: ${u.isAdmin})`));
      process.exit(1);
    }

    // Already admin?
    if (user.isAdmin) {
      console.log(`ℹ️   ${email} is already an admin.`);
      process.exit(0);
    }

    // Set isAdmin
    user.isAdmin = true;
    await user.save();

    console.log(`🎉  Success! ${email} is now an admin.`);
  } catch (err) {
    console.error('❌  Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeAdmin();
