import * as dashboardService from "./dashboard.service.js";

export const getSummary = async (req, res) => {
  try {
    const rows = await dashboardService.getSummary(req.user.userId);
    return res.status(200).json({ summary: rows });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
