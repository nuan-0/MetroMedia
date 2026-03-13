// /api/crowd.js
export default function handler(req, res) {
  const line = req.query.line || 'unknown';
  const statusOptions = ['Low', 'Medium', 'High', 'Very High'];
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

  res.status(200).json({ status });
}