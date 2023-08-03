const mongoose = require("mongoose");
require("dotenv").config();
const DATABASE_URL= process.env.DATABASE_URL
 
const connectDB = async () => {

  try {
    const DB_OPTIONS = {
        dbName: 'geekshop'
        };
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);

    console.log("Connected to MongoDB server Successfully");

  } 
  catch (err) {
      console.error('Error connecting to MongoDB:', err);
      process.exit(1)   // Exit the process with a failure code
  }
  
};

module.exports = connectDB;