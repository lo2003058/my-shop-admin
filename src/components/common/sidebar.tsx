'use client';

import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faBars,
  faAngleUp,
  faAngleDown,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { navigationRoute } from '@/config/navigationRoute';
import Link from 'next/link';
import Tooltip from '@/components/common/tooltip';
import Breadcrumbs from '@/components/common/breadcrumbs';

export default function SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State to track which "page" of the nav we are on
  const [currentPage, setCurrentPage] = useState(0);

  // How many items we show per page
  const itemsPerPage = 10;

  // Calculate slice indices
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the navigation array to get only the items for the current page
  const currentNavigation = navigationRoute.slice(startIndex, endIndex);

  // Handlers for paging
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (endIndex < navigationRoute.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Check if navigation is more than a single "page"
  const hasMultiplePages = navigationRoute.length > itemsPerPage;

  // Placeholder logout handler
  const handleLogout = () => {
    alert('Logged out!');
  };

  return (
    <>
      {/* MOBILE SIDEBAR (DIALOG) */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-white transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div
                className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <FontAwesomeIcon icon={faXmark} className="text-black" />
                </button>
              </div>
            </TransitionChild>

            {/* Make the inside a full flex-col, so logout can stick to bottom */}
            <div className="flex h-screen w-screen flex-col bg-white ring-1 ring-white/10">
              <div className="flex-shrink-0 flex items-center h-16 px-6">
                <Image
                  src="/images/happy-pepe.png"
                  alt="company logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </div>

              {/* Nav (scrollable area) */}
              <nav className="flex-1 overflow-y-auto px-6 pb-2">
                <ul role="list" className="-mx-2 space-y-1">
                  {currentNavigation.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className={`text-gray-400 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-xl p-2 text-sm font-semibold`}
                      >
                        <FontAwesomeIcon icon={item.icon} aria-hidden="true" className="size-6 shrink-0" />
                        <span className="truncate mt-1">{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Paging buttons (only if needed) */}
                {hasMultiplePages && (
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={handlePrev}
                      disabled={currentPage === 0}
                      className="disabled:opacity-40 p-2"
                    >
                      <FontAwesomeIcon icon={faAngleUp} className="text-black" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={endIndex >= navigationRoute.length}
                      className="disabled:opacity-40 p-2"
                    >
                      <FontAwesomeIcon icon={faAngleDown} className="text-black" />
                    </button>
                  </div>
                )}
              </nav>

              {/* Logout Button pinned at the bottom */}
              <div className="mt-auto flex justify-center p-4 gap-8">
                <Link
                  href="#"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  <Image src={`/images/happy-pepe.png`} alt={`user avatar`} width={32} height={32} />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* DESKTOP SIDEBAR */}
      <div
        className="border-r-2 hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:bg-white lg:ring-1 lg:ring-white/10"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center h-16">
            <Tooltip text={`Get rich!`} position={`right`}>
              <Link href={`/account`}>
                <div
                  className="inline-flex items-center justify-center p-1 bg-gray-100 rounded-full border-2 border-gray-600 hover:bg-gray-200"
                >
                  <Image
                    src="/images/happy-pepe.png"
                    alt="company logo"
                    width={64}
                    height={64}
                    className="h-8 w-auto rounded-full object-cover"
                    priority
                  />
                </div>
              </Link>
            </Tooltip>
          </div>

          {/* Nav (scrollable) */}
          <nav className="mt-4 flex-1 overflow-y-auto">
            <ul role="list" className="flex flex-col items-center space-y-1">
              {currentNavigation.map((item, index) => (
                <Tooltip key={index} text={item.name} position={`right`}>
                  <li>
                    <a
                      href={item.href}
                      className={`text-gray-400 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-3 text-sm font-semibold`}
                    >
                      <FontAwesomeIcon icon={item.icon} aria-hidden="true" className="size-6 shrink-0" />
                    </a>
                  </li>
                </Tooltip>
              ))}
            </ul>

            {/* Paging buttons (desktop) */}
            {hasMultiplePages && (
              <div className="flex flex-col items-center mt-4 space-y-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className="disabled:opacity-40 p-2"
                >
                  <FontAwesomeIcon icon={faAngleUp} className="text-black" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={endIndex >= navigationRoute.length}
                  className="disabled:opacity-40 p-2"
                >
                  <FontAwesomeIcon icon={faAngleDown} className="text-black" />
                </button>
              </div>
            )}
          </nav>

          {/* Logout Icon pinned at the bottom */}
          <div className="mt-auto flex items-center justify-center p-4">
            <Tooltip text={`Logout`} position={`right`}>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center h-10 w-10
                         rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Mobile top bar (hamburger) */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-400"
        >
          <span className="sr-only">Open sidebar</span>
          <FontAwesomeIcon icon={faBars} className="text-black" />
        </button>
      </div>

      {/*<Breadcrumbs />*/}
    </>
  );
}
