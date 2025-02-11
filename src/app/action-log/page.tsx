import React from 'react';
import { Metadata } from 'next';
import ActionLogPage from '@/components/action-log/actionLogPage';

export const metadata: Metadata = {
  title: 'Action log | Yin.co admin panel',
};

const ActionLog: React.FC = () => {
  return <ActionLogPage />;
};

export default ActionLog;
