import React from 'react';
import { Metadata } from 'next';
import TrashedModelPage from '@/components/model/trashedModelPage';

export const metadata: Metadata = {
  title: 'Trashed model | Yin.co admin panel',
};

const TrashedModel: React.FC = () => {
  return <TrashedModelPage />;
};

export default TrashedModel;
