require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth");
const contactsRoutes = require("./src/routes/contacts");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/contacts", contactsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
