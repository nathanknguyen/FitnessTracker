const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    type: {
        type: String,
        trim: true,
        required: "Enter cardio or resistance"
      },
    name: {
        type: String,
        trim: true,
        required: "Enter name of exercise"
      },
      duration: {
        type: Number,
        required: "Enter the duration of workout in minutes"
      },
      weight: {
        type: Number,
        required: "Enter weight used"
      },
      reps: {
        type: Number,
        required: "Enter the number of reps for this exercise"
      },
      sets: {
        type: Number,
        required: "Enter the number of sets for this exercise"
      },
      distance: {
          type: Number,
          required
      }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
