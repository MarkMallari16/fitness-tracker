const mongoose = require("mongoose");

const WorkoutSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        reps: {
            type: Number,
            required: true
        },
        load: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timeStamps: true
    }
)

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;