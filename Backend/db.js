import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB() {
    try {
        console.log("🔄 Connecting to MongoDB...", process.env.MONGO_URI);
        
        // Set global mongoose options
        mongoose.set('bufferCommands', false); // Disable command buffering
        
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
            socketTimeoutMS: 45000, // Socket timeout
            connectTimeoutMS: 45000, // Connection timeout
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 2, // Minimum number of connections in pool
            maxIdleTimeMS: 30000, // Close sockets after 30 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        });
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected, attempting to reconnect...');
        });
        
        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1); // Exit with failure if connection fails
    }
}

