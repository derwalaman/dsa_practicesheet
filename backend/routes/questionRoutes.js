import express from "express";
import {
  getQuestionsByTopic,
  toggleRevision,
  getSingleQuestion,
  addQuestion
} from "../controllers/questionController.js";

const router = express.Router();

// Get questions by topic
router.get("/:topic", getQuestionsByTopic);

// Toggle revision status
router.patch("/toggle-revision/:id", toggleRevision);

router.get("/single/:id", getSingleQuestion);

router.post("/add", addQuestion);

export default router;
