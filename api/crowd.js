export default function handler(req, res) {
  const line = req.query.line || 'unknown';
  const statusOptions = ['Low', 'Medium', 'High', 'Very High'];
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

  // Example: you could later use AdMob key here if needed
  const admobKey = process.env.ADMOB_KEY;

  res.status(200).json({ status });
}