const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../db");

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log("Ricevuto signup:", email, password);

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    console.log("existingUser:", existingUser.rows);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      hashedPassword,
    ]);

    console.log("Utente creato:", email);
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("🔥 Errore preciso:", error); // <-- vogliamo vedere questo
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
