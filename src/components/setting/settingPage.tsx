'use client';

import React from 'react';
import TitleComponent from '@/components/common/titleComponent';
import ContainersComponent from '@/components/common/containersComponent';

const SettingPage: React.FC = () => {

  return (
    <ContainersComponent>
      <TitleComponent
        title="Setting"
        routeName="setting"
      />

      <div className={`text-sm font-medium text-gray-500 capitalize my-4`}>
        Not implemented yet
      </div>
    </ContainersComponent>
  );
};

export default SettingPage;
