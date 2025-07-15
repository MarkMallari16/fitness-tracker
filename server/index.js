require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDb = require("./database");
const workoutRoutes = require("./routes/workoutRoutes");
const logger = require("./middleware/logger")


//port
const PORT = process.env.PORT || 5000;

const app = express();


//middleware
app.use(express.json());
app.use(logger);


//connect to Db
connectDb();


//Enable cors
app.use(cors());


app.use("/api/workouts", workoutRoutes);

app.listen(PORT, () => {
    console.log("Listen to port", process.env.PORT)
})


