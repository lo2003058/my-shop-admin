import React from "react";
import { Metadata } from "next";
import UserPage from '@/components/user/userPage';

export const metadata: Metadata = {
  title: "User | Yin.co admin panel",
};

const User: React.FC = () => {
  return <UserPage />;
};

export default User;
