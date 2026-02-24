import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { api } from "../utils/api";

interface SummaryRow {
  month: string;
  incomes: number;
  outcomes: number;
  saved: number;
  total_on_account: number;
  difference: number;
}

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kr`;
}

function formatMonth(month: string): string {
  const [year, monthNum] = month.split("-");
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function DashboardTable() {
  const [rows, setRows] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/api/dashboard/summary");
        setRows(response.summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <CircularProgress size={24} />
        <span className="ml-3 text-gray-600">Loading summary...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <TableContainer component={Paper} className="shadow-md">
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
            <TableCell sx={{ fontWeight: 600, fontSize: "16px" }}>Month</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "16px" }} align="right">Incomes</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "16px" }} align="right">Outcomes</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "16px" }} align="right">Saved</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "16px" }} align="right">Total on account</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "16px" }} align="right">Difference</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#9ca3af" }}>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-lg">No data yet</span>
                  <span className="text-sm">Add income and outcome data to see your summary</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.month}
                sx={{ "&:hover": { backgroundColor: "#f9fafb" }, transition: "background-color 0.2s" }}
              >
                <TableCell sx={{ fontSize: "15px" }}>{formatMonth(row.month)}</TableCell>
                <TableCell align="right" sx={{ fontSize: "15px", color: "#059669" }}>
                  {formatCurrency(row.incomes)}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: "15px", color: "#dc2626" }}>
                  {formatCurrency(row.outcomes)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: "15px", color: row.saved >= 0 ? "#059669" : "#dc2626" }}
                >
                  {formatCurrency(row.saved)}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: "15px", fontWeight: 600 }}>
                  {formatCurrency(row.total_on_account)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: "15px", color: row.difference >= 0 ? "#059669" : "#dc2626" }}
                >
                  {formatCurrency(row.difference)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
