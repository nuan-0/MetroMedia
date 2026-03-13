let messagesDB = {
  blue: [],
  red: [],
  green: []
};

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { line, message } = req.body;
  if (!line || !message) return res.status(400).json({ error: 'Missing parameters' });

  if (!messagesDB[line]) messagesDB[line] = [];
  messagesDB[line].push(message);

  res.status(200).json({ success: true });
}
