exports.createCourse = async (req, res) => {
  // TODO: connect prisma when schema ready
  res.json({ status: "stub" });
};

exports.getCourses = async (req, res) => {
  // TODO: connect prisma when schema ready
  res.json({ status: "stub", courses: [] });
};

exports.getCourseById = async (req, res) => {
  // TODO: connect prisma when schema ready
  res.json({ status: "stub", id: req.params.id });
};

exports.updateCourse = async (req, res) => {
  // TODO: connect prisma when schema ready
  res.json({ status: "stub", updated: true });
};

exports.deleteCourse = async (req, res) => {
  // TODO: connect prisma when schema ready
  res.json({ status: "stub", deleted: true });
};
