import React from "react";
import { Metadata } from "next";
import TierPage from '@/components/tier/tierPage';

export const metadata: Metadata = {
  title: "Tier | Yin.co admin panel",
};

const Tier: React.FC = () => {
  return <TierPage />;
};

export default Tier;
