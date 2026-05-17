import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.json');

const defaultData = {
  tutors: [],
  bookings: [],
  users: [
    { id: 'u1', name: 'Student 1', email: 'student1@example.com' }
  ]
};

export function getDb() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (error) {
    return defaultData;
  }
}

export function saveDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
