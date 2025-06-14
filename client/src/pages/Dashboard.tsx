import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Body from "../components/Body";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="flex flex-row w-full h-[calc(100vh-60px)]">
        <Sidebar />
        <Body />
      </div>
    </>
  );
}
