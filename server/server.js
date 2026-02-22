import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import incomesRoutes from "./routes/incomes.js";
import fixedCostsRoutes from "./routes/fixedCosts.js";
import monthlyOutcomesRoutes from "./routes/monthlyOutcomes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/incomes", incomesRoutes);
app.use("/api/fixed-costs", fixedCostsRoutes);
app.use("/api/monthly-outcomes", monthlyOutcomesRoutes);

app.get("/", (req, res) => res.send("API online"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
