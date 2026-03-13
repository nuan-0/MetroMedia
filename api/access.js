// access.js
let freeSessions = {}; // key = userId
let paidSessions = {}; // key = userId

export default async function handler(req, res) {
  const { userId, city, line, type } = req.query;
  if (!userId || !city || !line || !type) return res.status(400).json({error:'Missing parameters'});

  if (type === 'free') {
    freeSessions[userId] = {city, line, expiresIn: 10*60}; // 10min
    return res.status(200).json({expiresIn: 10*60});
  } else if (type === 'paid') {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
    const secondsLeft = Math.floor((endOfDay-now)/1000);
    paidSessions[userId] = {city, line, expiresIn: secondsLeft};
    return res.status(200).json({expiresIn: secondsLeft});
  } else {
    return res.status(400).json({error:'Invalid type'});
  }
}