export default function handler(req, res) {
  const { userId, line } = req.query;
  if (!userId || !line) return res.status(400).json({ allowed: false });

  // Demo logic: random access for now
  const allowed = Math.random() > 0.5;
  res.status(200).json({ allowed });
}
