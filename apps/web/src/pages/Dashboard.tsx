import Chart from "../components/Chart";
import ToDo from "../components/ToDo";
import DashboardTable from "../components/DashboardTable";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 p-6 w-full overflow-auto">
      <div className="flex flex-row gap-4">
        <Chart />
        <ToDo />
      </div>
      <DashboardTable />
    </div>
  );
}
