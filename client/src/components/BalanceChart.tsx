import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import type { MonthlyData } from "../types/dashboard.types";

// Props interface - component receives data from parent
interface BalanceChartProps {
  data: MonthlyData[];
}

// Recharts tooltip formatter - makes currency look nice
const formatCurrency = (value: number | undefined) =>
  value !== undefined ? `€${value.toFixed(0)}` : "";

const BalanceChart: React.FC<BalanceChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Monthly Balance Trend
      </h2>

      {/* ResponsiveContainer makes chart resize with window */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* Grid lines in background */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          {/* X axis shows months */}
          <XAxis dataKey="month" stroke="#666" style={{ fontSize: "14px" }} />

          {/* Y axis shows balance amounts */}
          <YAxis
            stroke="#666"
            style={{ fontSize: "14px" }}
            tickFormatter={formatCurrency}
          />

          {/* Hover tooltip */}
          <Tooltip
            formatter={formatCurrency}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

          {/* Legend at the top */}
          <Legend />

          {/* The actual line - green color for positive trend */}
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
            name="Balance (€)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;
