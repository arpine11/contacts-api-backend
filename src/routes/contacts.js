const express = require("express");
const db = require("../db/database");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// All routes below require login
router.use(authMiddleware);

// POST /contacts  (create)
router.post("/", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  const stmt = db.prepare(
    "INSERT INTO contacts (user_id, name, email, phone) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(req.user.id, name, email || null, phone || null);

  const created = db.prepare("SELECT * FROM contacts WHERE id = ?").get(result.lastInsertRowid);
  return res.status(201).json(created);
});

// GET /contacts  (list user contacts)
router.get("/", (req, res) => {
  const contacts = db
    .prepare("SELECT * FROM contacts WHERE user_id = ? ORDER BY id DESC")
    .all(req.user.id);

  return res.json(contacts);
});

// PUT /contacts/:id  (edit)
router.put("/:id", (req, res) => {
  const contactId = Number(req.params.id);
  const { name, email, phone } = req.body;

  if (!Number.isFinite(contactId)) {
    return res.status(400).json({ message: "Invalid contact id" });
  }

  // Ownership check
  const existing = db
    .prepare("SELECT * FROM contacts WHERE id = ? AND user_id = ?")
    .get(contactId, req.user.id);

  if (!existing) {
    return res.status(404).json({ message: "Contact not found" });
  }

  const updatedName = name ?? existing.name;
  const updatedEmail = email ?? existing.email;
  const updatedPhone = phone ?? existing.phone;

  db.prepare(
    `UPDATE contacts
     SET name = ?, email = ?, phone = ?, updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`
  ).run(updatedName, updatedEmail, updatedPhone, contactId, req.user.id);

  const updated = db
    .prepare("SELECT * FROM contacts WHERE id = ? AND user_id = ?")
    .get(contactId, req.user.id);

  return res.json(updated);
});

module.exports = router;
