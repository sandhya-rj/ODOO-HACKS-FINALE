const router = require("express").Router();

router.get("/", (req, res) => {
  res.json([{ id: "1", title: "Sample Course", published: true }]);
});

router.post("/", (req, res) => {
  res.json({
    message: "course create endpoint ready",
    body: req.body,
  });
});

module.exports = router;
