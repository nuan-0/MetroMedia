// In-memory message storage
let messagesDB = {
  blue: [],
  red: [],
  green: []
};

export default function handler(req, res) {
  const line = req.query.line;
  if (!line) return res.status(400).json({ error: 'Missing line parameter' });

  const messages = messagesDB[line] || [];
  res.status(200).json({ messages });
}