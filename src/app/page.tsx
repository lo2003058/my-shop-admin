import React from "react";
import { Metadata } from "next";
import DashboardPage from '@/components/main/dashboardPage';

export const metadata: Metadata = {
  title: "Dashboard | Yin.co",
};

const Dashboard: React.FC = () => {
  return <DashboardPage />;
};

export default Dashboard;
