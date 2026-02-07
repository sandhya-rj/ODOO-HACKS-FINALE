const prisma = require("../lib/prisma");
const adapter = require("../services/insightDataAdapter.service");
const insight = require("../services/insight.service");
const fmt = require("../services/alertFormatter.service");

exports.completeLesson = async (req, res, next) => {
  try {
    const { userId, lessonId } = req.body;

    const progress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      include: { lesson: true },
    });

    if (!progress) {
      return res.status(404).json({ error: "Lesson progress not found" });
    }

    const mapped = adapter.fromLessonProgress(progress);

    // expectedTime comes from lesson's durationSeconds
    const expectedTime = progress.lesson.durationSeconds || 600;

    const pace = insight.lessonPacingInsight({
      timeSpent: mapped.timeSpent,
      expectedTime,
    });

    if (pace.flag) {
      return res.json({
        completed: true,
        alert: fmt.formatAlert({
          ...pace,
          source: "lesson",
        }),
      });
    }

    res.json({ completed: true });
  } catch (err) {
    next(err);
  }
};
