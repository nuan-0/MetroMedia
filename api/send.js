// send.js
let chatDatabase = {}; // in-memory for demo; key = city_line

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { city, line, message, userId } = req.body;
  if (!city || !line || !message || !userId) return res.status(400).json({error:'Missing parameters'});

  const key = `${city}_${line}`;
  if (!chatDatabase[key]) chatDatabase[key] = [];
  chatDatabase[key].push({userId, message, timestamp: Date.now()});

  res.status(200).json({success:true});
}