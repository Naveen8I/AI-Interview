
const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: "Not answered", // ✅ Default if user doesn't answer
  },
  feedback: {
    type: String,
    default: "", // ✅ Store Gemini's feedback after submission
  },
  sessionId: {
    type: String,
    default: () => new Date().getTime().toString(), // group multiple questions if needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  score:{
    type:Number,
    default: 0, // ✅ Default score if not provided
  }
});

module.exports = mongoose.model("Question", QuestionSchema);
