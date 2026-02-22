import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./features/auth/auth.routes.js";
import transactionRoutes from "./features/transactions/transactions.routes.js";
import incomesRoutes from "./features/incomes/incomes.routes.js";
import fixedCostsRoutes from "./features/fixed-costs/fixed-costs.routes.js";
import monthlyOutcomesRoutes from "./features/monthly-outcomes/monthly-outcomes.routes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/incomes", incomesRoutes);
app.use("/api/fixed-costs", fixedCostsRoutes);
app.use("/api/monthly-outcomes", monthlyOutcomesRoutes);

app.get("/", (req, res) => res.send("API online"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
