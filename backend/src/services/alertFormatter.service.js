exports.formatAlert = ({ type, message, source }) => ({
  alertId: Date.now().toString(),
  source,
  type,
  message,
  severity:
    type.includes("STRUGGLE")
      ? "high"
      : type.includes("DIFFICULT")
      ? "medium"
      : "low",
  createdAt: new Date().toISOString(),
});
