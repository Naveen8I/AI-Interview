
const mongoose = require("mongoose");
const Question = require("../models/Question");
const axios = require("axios");

exports.generateQuestion = async (req, res) => {
  const { topic, sessionId } = req.body;
  const userId = req.user?.id; // ✅ Authenticated user from token

  try {
    const geminiRes = await axios.post("http://localhost:8000/generate-question", { topic });
    const question = geminiRes.data.question;

    const newQ = new Question({
      userId,
      topic,
      question,
      sessionId: sessionId?.trim() ? sessionId : new mongoose.Types.ObjectId().toString(),
      answer: "", // ✅ Initially unanswered
    });

    await newQ.save();

    res.status(200).json({ question, questionId: newQ._id, sessionId: newQ.sessionId });

  } catch (err) {
    console.error("❌ Error generating question:", err.message);
    res.status(500).json({ error: "Failed to generate question" });
  }
};

exports.submitAnswer = async (req, res) => {
  const { answer, questionId } = req.body;
  const userId = req.user?.id;

  try {
    const questionDoc = await Question.findById(questionId);

    if (!questionDoc) {
      return res.status(404).json({ error: "Question not found" });
    }

    // ✅ Ensure the user owns the question
    if (questionDoc.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to submit answer for this question" });
    }

    const geminiRes = await axios.post("http://localhost:8000/submit-answer", {
      question: questionDoc.question,
      answer: answer || "Not answered", // ✅ Default if user submitted nothing
    });

    // ✅ Save answer (even if blank)
    questionDoc.answer = answer || "Not answered";
    questionDoc.feedback = geminiRes.data.feedback;
    questionDoc.score = geminiRes.data.score;
    await questionDoc.save();

    res.status(200).json({ feedback: geminiRes.data.feedback,
      score: geminiRes.data.score,
     });
  } catch (err) {
    console.error("❌ Error submitting answer:", err.message);
    res.status(500).json({ error: "Answer submission failed" });
  }
};

exports.getHistory = async (req, res) => {
  const userId = req.user?.id;

  try {
    const questions = await Question.find({ userId }).sort({ createdAt: -1 });

    // Group by topic and sessionId
    const grouped = {};
    for (const q of questions) {
      if (!grouped[q.topic]) grouped[q.topic] = {};
      if (!grouped[q.topic][q.sessionId]) grouped[q.topic][q.sessionId] = [];
      grouped[q.topic][q.sessionId].push(q);
    }

    res.status(200).json(grouped);
  } catch (err) {
    console.error("❌ Error fetching history:", err.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

exports.getPerformanceBySession = async (req, res) => {
  const userId = req.user?.id;
  try {
    const allQs = await Question.find({ userId }).sort({ createdAt: 1 });
    const sessionMap = {};

    for (const q of allQs) {
      if (!sessionMap[q.sessionId]) {
        sessionMap[q.sessionId] = {
          sessionId: q.sessionId,
          scores: [],
          topic: q.topic,
          createdAt: q.createdAt,
        };
      }
      sessionMap[q.sessionId].scores.push(q.score || 0);
    }

    const result = Object.values(sessionMap).map((s) => ({
      sessionId: s.sessionId,
      topic: s.topic,
      averageScore: (s.scores.reduce((a, b) => a + b, 0) / s.scores.length).toFixed(2),
      createdAt: s.createdAt,
    }));

    res.json(result);
  } catch (err) {
    console.error('❌ Performance chart error:', err.message);
    res.status(500).json({ error: 'Failed to fetch performance chart' });
  }
};