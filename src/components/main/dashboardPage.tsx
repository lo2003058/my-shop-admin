'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import LoadingComponent from '@/components/common/loadingComponent';

/** DashboardPage Component */

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') return <LoadingComponent />;

  return (
    <div className="bg-white h-screen">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold">Welcome back, {session?.user.email}!</h1>
        <p className="text-lg mt-4">You are now logged in.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
