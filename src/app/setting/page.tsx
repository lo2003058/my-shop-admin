import React from 'react';
import { Metadata } from 'next';
import SettingPage from '@/components/setting/settingPage';

export const metadata: Metadata = {
  title: 'Setting | Yin.co admin panel',
};

const Setting: React.FC = () => {
  return <SettingPage />;
};

export default Setting;
