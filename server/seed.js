require("dotenv").config();

//workout model
const Workout = require("./models/workout");
const mongoose = require("mongoose");

//mockup data
const workouts = [
    { title: "Bench Press", reps: 8, load: 100 },
    { title: "Deadlift", reps: 5, load: 140 },
    { title: "Squats", reps: 10, load: 120 },
    { title: "Overhead Press", reps: 6, load: 60 },
    { title: "Pull Ups", reps: 12, load: 0 },
];

const seedWorkout = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Workout.deleteMany({});
        console.log("Cleared old workout");

        const created = await Workout.insertMany(workouts);
        console.log(`✅ Inserted ${created.length} workouts`);

        process.exit();
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

seedWorkout();
