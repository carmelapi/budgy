import BalanceChart from "./BalanceChart";
import TransactionTable from "./TransactionTable";
import TodoCard from "./TodoCard";
import type { MonthlyData } from "../types/dashboard.types";

// Static data for the balance chart (6 months of demo data)
const staticBalanceData: MonthlyData[] = [
  { month: "Sep", balance: 2500 },
  { month: "Oct", balance: 2800 },
  { month: "Nov", balance: 2400 },
  { month: "Dec", balance: 3100 },
  { month: "Jan", balance: 2900 },
  { month: "Feb", balance: 3200 },
];

export default function Body() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <div className="flex flex-row gap-4">
        <BalanceChart data={staticBalanceData} />
        <TodoCard />
      </div>
      <div>
        <TransactionTable />
      </div>
    </div>
  );
}
