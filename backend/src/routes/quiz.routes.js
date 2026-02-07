const router = require("express").Router();
const ctrl = require("../controllers/quiz.controller");
const v = require("../middleware/validateInsight");

router.post("/submit", v.validateQuizSubmit, ctrl.submitQuiz);

module.exports = router;
