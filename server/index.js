require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDb = require("./database");
const workoutRoutes = require("./routes/workoutRoutes");
const logger = require("./middleware/logger")

//port
const PORT = process.env.PORT || 5000;

//initializing express;
const app = express();

//connect to Db
connectDb();

//body parser and custom middleware
app.use(express.json());
app.use(logger);

//Enable cors
app.use(cors());

//routes
app.use("/api/workouts", workoutRoutes);

//start server
app.listen(PORT, () => {
    console.log("Listen to port", process.env.PORT)
})


