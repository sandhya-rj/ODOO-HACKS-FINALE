const router = require("express").Router();
const ctrl = require("../controllers/lesson.controller");
const v = require("../middleware/validateInsight");

router.post("/complete", v.validateLessonComplete, ctrl.completeLesson);

module.exports = router;
