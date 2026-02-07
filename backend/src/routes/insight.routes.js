const router = require("express").Router();
const ctrl = require("../controllers/insight.controller");
const svc = require("../services/insight.service");

router.get("/mock-batch", ctrl.mockRiskBatch);
router.post("/lesson", ctrl.testLessonInsight);
router.post("/learner", ctrl.testLearnerInsight);
router.post("/course-dropoff", (req, res) => {
  res.json(svc.courseDropoffInsight(req.body.rates));
});

module.exports = router;
