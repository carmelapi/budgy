import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import * as authService from "./auth.service.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, base_currency = "SEK", language = "EN" } = req.body;

  try {
    if (!["SEK", "EUR"].includes(base_currency)) {
      return res
        .status(400)
        .json({ message: "Invalid currency. Supported: SEK, EUR" });
    }
    if (!["EN", "IT"].includes(language)) {
      return res
        .status(400)
        .json({ message: "Invalid language. Supported: EN, IT" });
    }

    const existing = await authService.findUserByEmail(email);
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const newUser = await authService.createUser(
      email,
      password,
      base_currency,
      language,
    );
    const token = authService.generateToken(newUser.id, newUser.email);
    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        base_currency: newUser.base_currency,
        language: newUser.language,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await authService.verifyPassword(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid password" });

    const token = authService.generateToken(user.id, user.email);
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        base_currency: user.base_currency || "SEK",
        language: user.language || "EN",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/settings", verifyToken, async (req, res) => {
  const { base_currency, language } = req.body;

  try {
    if (base_currency && !["SEK", "EUR"].includes(base_currency)) {
      return res.status(400).json({ message: "Invalid currency" });
    }
    if (language && !["EN", "IT"].includes(language)) {
      return res.status(400).json({ message: "Invalid language" });
    }

    const user = await authService.updateSettings(req.user.userId, {
      base_currency,
      language,
    });
    if (!user) return res.status(400).json({ message: "No fields to update" });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        base_currency: user.base_currency,
        language: user.language,
      },
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
