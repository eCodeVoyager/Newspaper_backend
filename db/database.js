const mongoose = require("mongoose");

require("dotenv").config();

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    // Connect to MongoDB
    await mongoose.connect(mongoURI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);

    // Exit the process if the connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
