const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE);
        console.log(`MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        if (error.message.includes('querySrv ECONNREFUSED')) {
            console.error('\n---> The server cannot resolve the SRV record for MongoDB Atlas! <---');
            console.error('---> Please log into your MongoDB Atlas Dashboard. <---');
            console.error('---> Go to Connect -> Connect your application. <---');
            console.error('---> Check the box for "Choose a connection method" and select a driver version older than 3.4. <---');
            console.error('---> Get the connection string (it starts with mongodb:// instead of mongodb+srv://) and use that in your config.env file. <---');
        }
        process.exit(1);
    }
};

module.exports = connectDB;
