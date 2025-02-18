'use client';

import React, { useState } from 'react';
import TitleComponent from '@/components/common/titleComponent';
import ContainersComponent from '@/components/common/containersComponent';
import { Role, RolesData } from '@/types/role/types';
import { useQuery } from '@apollo/client';
import { GET_ROLES } from '@/graphql/role/queries';
import LoadingComponent from '@/components/common/loadingComponent';
import RoleFormModal from '@/components/role/form/roleFormModal';
import Tooltip from '@/components/common/tooltip';
import { Button } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const RolePage: React.FC = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);

  const { data, loading, error, refetch } = useQuery<RolesData>(GET_ROLES);

  const handleOpenModalForCreate = () => {
    setEditRole(null);
    setModalOpen(true);
  };

  const handleOpenModalForEdit = (data: Role) => {
    setEditRole(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    refetch().finally(() => {
      setModalOpen(false);
    });
  };

  if (loading) return <LoadingComponent />;

  if (error) {
    console.error(error);
    return (
      <ContainersComponent>
        <p className="text-red-500">Error loading roles.</p>
      </ContainersComponent>
    );
  }

  const roles = data?.roles ?? [];

  return (
    <ContainersComponent>
      <TitleComponent
        title="Role"
        routeName="role"
        isShowCreateButton
        createButtonOnClick={handleOpenModalForCreate}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black py-4">
        {roles.length > 0 && roles.map((role) => (
          <div
            className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow"
            key={role.id}
          >
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div className="text-lg font-semibold">{role.name}</div>
              <Tooltip text="Edit" position="bottom">
                <div
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleOpenModalForEdit(role)}
                >
                  <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                    <FontAwesomeIcon icon={faPen} />
                  </Button>
                </div>
              </Tooltip>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(role.permissions)
                  ? role.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                    >
                        {permission}
                      </span>
                  ))
                  : (
                    <span
                      className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {role.permissions}
                    </span>
                  )
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      <RoleFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editRole={editRole}
      />
    </ContainersComponent>
  );
};

export default RolePage;
