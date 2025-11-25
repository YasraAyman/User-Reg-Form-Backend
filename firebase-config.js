// 📄 firebase-config.js
// Final, robust version to read JSON in an ES Module environment

import admin from 'firebase-admin';
import fs from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url';

// 1. Setup path helpers for ES Modules to locate the service key file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Load and parse the JSON file synchronously
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// 3. Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "user-reg-form" // <-- MAKE SURE THIS IS YOUR PROJECT ID
});

// 4. Get the Firestore database instance
const db = admin.firestore();

// 5. Export the database instance for use in server.js
export {
  db,
  admin
};