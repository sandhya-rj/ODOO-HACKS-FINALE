require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/courses", require("./routes/course.routes"));
app.use("/alerts", require("./routes/alert.routes"));
app.use("/quiz", require("./routes/quiz.routes"));
app.use("/insights", require("./routes/insight.routes"));
app.use("/lesson", require("./routes/lesson.routes"));

app.get("/health", (req, res) => res.json({ ok: true }));

// Error handler must be last
app.use(require("./middleware/errorHandler"));

module.exports = app;
