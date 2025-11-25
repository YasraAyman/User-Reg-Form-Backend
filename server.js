// 📄 server.js

import express from "express";
import cors from "cors";
import { db } from "./firebase-config.js"; 

const app = express();
const PORT = 5000; // Standard port for local backend

// --- Middleware Setup ---
app.use(cors());
app.use(express.json()); 

// COLLECTION REFERENCE
const usersRef = db.collection("users"); // Ensure your Firestore collection is named 'users'

// --- API Endpoints (CRUD) ---

/**
 * POST /api/users - CREATE USER
 */
app.post("/api/users", async (req, res) => {
  try {
    const data = req.body;
    // Data received from the HTML form: fullName, email, phone, address, role, DOB, Gender
    
    // Add validation here if needed (e.g., check for existence of required fields)

    const docRef = await usersRef.add(data); 
    res.status(201).json({ message: "User registered successfully", id: docRef.id });
  } catch (error) {
    console.error("Error creating user:", error); 
    res.status(500).json({ error: "Failed to add user", details: error.message });
  }
});

/**
 * GET /api/users - READ ALL USERS
 */
app.get("/api/users", async (req, res) => {
  try {
    const snapshot = await usersRef.get();
    const users = [];

    snapshot.forEach(doc => {
      // The frontend script expects the document ID to be named '_id'
      users.push({ _id: doc.id, ...doc.data() }); 
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Failed to fetch users", details: error.message });
  }
});

/**
 * PUT /api/users/:id - UPDATE USER
 */
app.put("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    
    // Update the document with the data from the frontend update form
    await usersRef.doc(id).update(updatedData); 
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user", details: error.message });
  }
});

/**
 * DELETE /api/users/:id - DELETE USER
 */
app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await usersRef.doc(id).delete();
    res.status(204).json(); // 204 No Content for successful deletion
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user", details: error.message });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});