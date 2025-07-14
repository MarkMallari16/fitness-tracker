require("dotenv").config();

const mongoose = require("mongoose");
const Workout = require("../models/workout");

//get all workout
const getAllWorkouts = async (req, res) => {
    try {
        const workout = await Workout.find().sort({ createdAt: -1 });

        res.status(200).json(workout);
    } catch (error) {
        res.status(404).json({ errorMessage: error })
        console.error(error)
    }
}

//get specific workout
const getWorkout = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid workout ID" });
        }

        //get the id in mongo db
        const workout = await Workout.findById(id);

        //validate
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" })
        }

        //back to frontend
        res.status(200).json(workout);
    } catch (error) {
        res.status(404).json({ message: error.message })
        console.error(error);
    }
}

//add workout
const addWorkout = async (req, res) => {
    try {
        const { title, reps, load } = req.body;

        const workout = await Workout.create({ title, reps, load });

        res.status(201).json(workout);
    } catch (error) {
        res.status(404).json({ errorMessage: error.message })
        consoler.error(error)
    }
}

const deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;


        const workout = await Workout.findByIdAndDelete(id);

        if (!workout) {
            return res.status(404).json({ error: "workout not found." })
        }

        res.status(200).json(workout);

    } catch (error) {
        res.status(404).json({ errorMessage: error.message })
        consoler.error(error)
    }
}

const updateWorkout = async (req, res) => {
    try {
        const { id } = req.params;

        const workout = await Workout.findByIdAndUpdate(id, req.body, { new: true });

        if (!workout) {
            return res.status(404).json({ error: "workout not found." })
        }

        res.status(200).json(workout);
    } catch (error) {
        res.status(404).json({ errorMessage: error.message })
        consoler.error(error)
    }
}
module.exports = { getAllWorkouts, getWorkout, addWorkout, deleteWorkout, updateWorkout };