const express = require("express");
const router = express.Router();

const { getAllWorkouts, getWorkout, addWorkout, deleteWorkout, updateWorkout } = require("../controllers/workoutController");

//get all workouts
router.get("/", getAllWorkouts);

//get workout
router.get("/:id", getWorkout);

//add workout
router.post("/", addWorkout);

//delete workout
router.delete("/:id", deleteWorkout)

//update workout
router.patch("/:id", updateWorkout);

//export so that it access of other files
module.exports = router;