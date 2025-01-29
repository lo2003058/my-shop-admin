'use client';

import './globals.css';
import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { apolloClient } from '@/lib/apolloClient';
import { ApolloProvider } from '@apollo/client';
import SideBar from '@/components/common/sidebar';
import Breadcrumbs from '@/components/common/breadcrumbs';

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
    <body className={'bg-gray-100'}>
    <SessionProvider>
      <ApolloProvider client={apolloClient}>
        <SideBar />
        <Breadcrumbs />
        {children}
      </ApolloProvider>
    </SessionProvider>
    </body>
    </html>
  );
};

export default RootLayout;
