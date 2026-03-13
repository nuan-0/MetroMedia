// /api/send.js
import { messagesDB, sessionsDB } from './db';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { line, message, userId } = req.body;
  if (!line || !message || !userId) return res.status(400).json({ error: 'Missing parameters' });

  const session = sessionsDB[userId];
  if (!session) return res.status(403).json({ error: 'No active session' });

  // Check if user is allowed to send
  const now = Date.now();
  if (session.type === 'free' && now - session.startTime > 10 * 60 * 1000)
    return res.status(403).json({ error: 'Free session expired' });

  if (!messagesDB[line]) messagesDB[line] = [];
  messagesDB[line].push({ userId, message, time: now });

  res.status(200).json({ success: true });
}