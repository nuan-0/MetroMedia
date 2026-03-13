// /api/db.js
export const messagesDB = {
  blue: [],
  red: [],
  green: []
};

// Track free/paid sessions
export const sessionsDB = {
  // userId: { line, type: 'free'|'paid', startTime: timestamp }
};

export function resetAll() {
  messagesDB.blue = [];
  messagesDB.red = [];
  messagesDB.green = [];
  // Optional: reset sessions at midnight
  for (const userId in sessionsDB) delete sessionsDB[userId];
}
