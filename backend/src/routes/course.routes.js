const router = require("express").Router();
const courseController = require("../controllers/course.controller");

router.get("/", (req, res) => {
  res.json([{ id: "1", title: "Sample Course", published: true }]);
});

router.post("/", (req, res) => {
  res.json({
    message: "course create endpoint ready",
    body: req.body,
  });
});

// GET /courses/:courseId/enrollment - Get enrollment status
router.get("/:courseId/enrollment", courseController.getEnrollmentStatus);

// POST /course/complete - Mark course as completed and notify instructor
router.post("/complete", courseController.completeCourse);

// POST /courses/reset-demo - Reset all demo data for fresh demo
router.post("/reset-demo", courseController.resetDemo);

module.exports = router;
