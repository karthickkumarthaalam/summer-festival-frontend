import BreadCrumb from "../components/BreadCrumb";
import CopyrightFooter from "../components/CoyprightFooter";
import DashboardContent from "../components/DashboardContent";

const Dashboard = () => {
  return (
    <>
      <BreadCrumb title={"Dashboard"} paths={["Dashboard"]} />
      <div className="flex-1 overflow-y-auto">
        <DashboardContent />
      </div>
      <CopyrightFooter />
    </>
  );
};

export default Dashboard;
