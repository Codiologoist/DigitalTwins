/**
 * This file is used when we Test the database using npm run test
 * We connect to the database, run the tests, and then drop the database
 */

import { MongooseError } from "mongoose";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Variables
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('Missing MONGO_URI for dropping test database.');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoURI).catch(function (err : MongooseError) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
});
// Drop the database
mongoose.connection.dropDatabase().then(function () {
    console.log(`Dropped database: ${mongoURI}`);
    process.exit(0);
});
