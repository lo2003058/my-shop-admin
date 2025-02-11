'use client';

import './globals.css';
import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { apolloClient } from '@/lib/apolloClient';
import { ApolloProvider } from '@apollo/client';
import SideBar from '@/components/common/sidebar';
import Breadcrumbs from '@/components/common/breadcrumbs';
import { usePathname } from 'next/navigation';

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => {
  const pathname = usePathname();

  // The set of routes where we DON'T want to show the sidebar and breadcrumbs
  const clearRoutes = ['/auth/signin'];

  // If the current path is in clearRoutes, do NOT show sidebar/breadcrumbs
  const shouldHideSidebar = clearRoutes.includes(pathname);

  return (
    <html lang="en">
    <body className="bg-gray-100">
    <SessionProvider>
      <ApolloProvider client={apolloClient}>
        {!shouldHideSidebar && (
          <>
            <SideBar />
            <Breadcrumbs />
          </>
        )}
        {children}
      </ApolloProvider>
    </SessionProvider>
    </body>
    </html>
  );
};

export default RootLayout;
