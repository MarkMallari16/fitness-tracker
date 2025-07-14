const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB successfully connected.");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDb;