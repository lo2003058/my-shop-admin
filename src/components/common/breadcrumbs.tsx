'use client';

import React from 'react';
import {
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Breadcrumbs() {

  const pathname = usePathname();

  return (
    <nav aria-label="Breadcrumb" className="flex border-b border-gray-200 bg-white">
      <ol role="list" className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">
        <li className="flex">
          <div className="flex items-center">
            <Link href="/" className="text-gray-400 hover:text-gray-500">
              <FontAwesomeIcon icon={faHome} className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        <div className="flex items-center">
          <svg
            fill="currentColor"
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="h-full w-6 shrink-0 text-gray-200"
          >
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>
          <div
            className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            {/*<Link href={pathname} className={`capitalize`}>*/}
            {/*  {pathname !== '/' ? pathname.replace('/', '') : 'Dashboard'}*/}
            {/*</Link>*/}
            <p className={`capitalize select-none`}>
              {pathname !== '/' ? pathname.replace('/', '') : 'Dashboard'}
            </p>
          </div>
        </div>
      </ol>
    </nav>
  );
}
