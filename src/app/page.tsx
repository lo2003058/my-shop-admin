import React from "react";
import { Metadata } from "next";
// import DashboardPage from '@/components/main/dashboardPage';
import DashboardPageDemo from '@/components/main/dashboardPageDemo';

export const metadata: Metadata = {
  title: "Dashboard | Yin.co",
};

const Dashboard: React.FC = () => {
  return (
    <>
      {/*<DashboardPage />*/}
      <DashboardPageDemo />
    </>
  );
};

export default Dashboard;
