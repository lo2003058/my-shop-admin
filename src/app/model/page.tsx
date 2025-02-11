import React from "react";
import { Metadata } from "next";
import ModelPage from '@/components/model/modelPage';

export const metadata: Metadata = {
  title: "Model | Yin.co admin panel",
};

const Model: React.FC = () => {
  return <ModelPage />;
};

export default Model;
