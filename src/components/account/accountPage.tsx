'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import LoadingComponent from '@/components/common/loadingComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PasswordBox from '@/components/account/form/passwordBox';
import ContainersComponent from '@/components/common/containersComponent';
import TitleComponent from '@/components/common/titleComponent';

const AccountPage: React.FC = () => {
  const { data: session, status } = useSession();

  // Show a loading indicator while session data is being fetched
  if (status === 'loading') {
    return <LoadingComponent />;
  }

  // Safely handle missing fields
  const userEmail = session?.user?.email ?? 'No email available';
  const userRoleName = session?.user?.role?.name ?? 'No role available';
  const userPermissions = session?.user?.role?.permissions ?? [];

  return (
    <ContainersComponent>
      <TitleComponent title={'Account'} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT COLUMN: User Info */}
          <div className="flex-1 bg-white shadow border sm:rounded-lg p-6">
            <div className="px-4 sm:px-0">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-700" />
                <h3 className="text-base/7 font-semibold text-gray-900">User Information</h3>
              </div>
              <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                Personal details for your account
              </p>
            </div>

            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                {/* Email row */}
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Email address</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {userEmail}
                  </dd>
                </div>

                {/* Role row */}
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Role</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {userRoleName}
                  </dd>
                </div>

                {/* Permissions row */}
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Permissions</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {userPermissions.length === 0 ? (
                      <span>No permissions</span>
                    ) : (
                      userPermissions.map((permission, index) => (
                        <div
                          key={index}
                          className="select-none inline-flex items-center gap-x-1.5 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 m-1"
                        >
                          <svg
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                            className="h-1.5 w-1.5 fill-blue-500"
                          >
                            <circle r={3} cx={3} cy={3} />
                          </svg>
                          {permission}
                        </div>
                      ))
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* RIGHT COLUMN: Password Update Box */}
          {session?.user?.id && (
            <div className="flex-1">
              <PasswordBox userId={session.user.id} />
            </div>
          )}
        </div>
      </div>
    </ContainersComponent>
  );
};

export default AccountPage;
