import * as service from "./account-balances.service.js";

export const upsert = async (req, res) => {
  try {
    const { month, amount } = req.body;
    if (!month || amount === undefined) {
      return res.status(400).json({ message: "Month and amount are required" });
    }
    const balance = await service.upsert(req.user.userId, { month, amount: Number(amount) });
    return res.status(200).json({ balance });
  } catch (error) {
    console.error("Error saving account balance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAll = async (req, res) => {
  try {
    const balances = await service.getAll(req.user.userId);
    return res.status(200).json({ balances });
  } catch (error) {
    console.error("Error fetching account balances:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
