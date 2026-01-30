const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const router = express.Router();

// POST /auth/register
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  // Hash password
  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    const stmt = db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
    const result = stmt.run(username, passwordHash);

    return res.status(201).json({ message: "User registered", userId: result.lastInsertRowid });
  } catch (err) {
    if (String(err).includes("UNIQUE")) {
      return res.status(409).json({ message: "Username already exists" });
    }
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
});

// POST /auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create token
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.json({ message: "Login success", token });
});

module.exports = router;
