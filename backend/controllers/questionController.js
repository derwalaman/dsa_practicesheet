import Questions from "../models/Questions.js";

// Fetch questions by topic with companies populated
export const getQuestionsByTopic = async (req, res) => {
  try {
    const topic = req.params.topic;
    console.log("Fetching questions for topic:", topic);
    // Assuming your Question model has a `topic` field
    const validTopic = topic[0].toUpperCase() + topic.slice(1).toLowerCase();
    console.log("Valid topic:", validTopic);
    const questions = await Questions.find({ topic: validTopic })

    if (!questions.length) {
      return res.status(404).json({ message: "No questions found for this topic" });
    }

    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Toggle revision status of a question
export const toggleRevision = async (req, res) => {
  try {
    const questionId = req.params.id;

    const question = await Questions.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.revision = !question.revision;
    await question.save();

    res.json({ message: "Revision status updated", revision: question.revision });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSingleQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Questions.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ question });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const data = req.body;
    // Validate data if needed

    // Convert comma-separated strings to arrays if needed
    if (typeof data.companies === "string") {
      data.companies = data.companies.split(",").map((c) => c.trim());
    }
    if (typeof data.platform === "string") {
      data.platform = data.platform.split(",").map((p) => p.trim());
    }

    const newQuestion = new Questions(data);
    await newQuestion.save();
    res.status(201).json({ message: "Question added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add question" });
  }
};