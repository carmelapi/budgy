import Chart from "../components/Chart";
import ToDo from "../components/ToDo";
import DashboardTable from "../components/DashboardTable";

export default function Dashboard() {
  return (
    <div className="page-content">
      <div className="flex flex-row gap-4">
        <Chart />
        <ToDo />
      </div>
      <DashboardTable />
    </div>
  );
}
