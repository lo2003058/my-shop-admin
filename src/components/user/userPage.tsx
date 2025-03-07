'use client';

import React, { useCallback, useState } from 'react';
import TitleComponent from '@/components/common/titleComponent';
import ContainersComponent from '@/components/common/containersComponent';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USERS_PAGINATED } from '@/graphql/user/queries';
import { useSession } from 'next-auth/react';
import { User, UsersData } from '@/types/user/types';
import PaginationButtons from '@/components/common/paginationButtons';
import { DataTableComponent } from '@/components/common/dataTableComponent';
import { userFields } from '@/config/tableFields';
import Swal from 'sweetalert2';
import { usePathname } from 'next/navigation';
import _ from 'lodash';
import { REMOVE_USER } from '@/graphql/user/mutation';
import UserFormModal from '@/components/user/form/userFormModal';

const UserPage: React.FC = () => {
  const { data: session } = useSession();
  const adminToken = session?.accessToken;

  const rawPathname = usePathname();
  const pathname = rawPathname.replace('/', '');

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  // Page size config
  const pageSize = 10;

  // GraphQL Query
  const { data, error, refetch } = useQuery<UsersData>(
    GET_USERS_PAGINATED,
    {
      variables: {
        page,
        pageSize,
        filter: {
          searchTerm: searchTerm,
        },
      },
      skip: !adminToken,
      context: {
        headers: { 'authorization-admin': `Bearer ${adminToken}` },
      },
      fetchPolicy: 'network-only',
    },
  );

  const [removeUser] = useMutation(REMOVE_USER);


  const refetchData = useCallback(
    (newPage: number) => {
      // Update page state
      setPage(newPage);
      // Trigger Apollo to fetch, but always render the DataTable
      refetch({
        page: newPage,
        pageSize,
        filter: { searchTerm },
      }).catch((err) => console.error('Error fetching data:', err));
    },
    [pageSize, searchTerm, refetch],
  );

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleOpenModalForCreate = () => {
    setEditUser(null);
    setModalOpen(true);
  };

  const handleOpenModalForEdit = (data: User) => {
    setEditUser(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    refetch().finally(() => {
      setModalOpen(false);
    });
  };

  const handleDelete = async (item: User) => {
    await Swal.fire({
      title: `Delete ${pathname}`,
      text: `Are you sure you want to delete this ${pathname}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
        if (result.isConfirmed) {
          await removeUser({
            variables: { id: item.id },
            context: {
              headers: { 'authorization-admin': `Bearer ${adminToken}` },
            },
          })
            .then(async () => {
              await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Deleted Successfully',
                text: `${_.capitalize(pathname)} has been deleted.`,
                showConfirmButton: false,
                timer: 1500,
              });
            })
            .finally(() => {
              refetch(); // or any other state update needed
            });
        }
      },
    );
  };

  const goToNextPage = useCallback(() => {
    const totalPages = data?.paginatedUsers?.totalPages ?? 1;
    if (page < totalPages) {
      refetchData(page + 1);
    }
  }, [page, data, refetchData]);

  const goToPreviousPage = useCallback(() => {
    if (page > 1) {
      refetchData(page - 1);
    }
  }, [page, refetchData]);

  // If error, show it, but keep the table unmounted
  if (error) {
    console.error(error);
    return (
      <ContainersComponent>
        <p className="text-red-500">Error loading model.</p>
      </ContainersComponent>
    );
  }

  // Decide how to grab products and total pages
  const users = data?.paginatedUsers?.items ?? [];
  const totalPages = data?.paginatedUsers?.totalPages ?? 1;

  return (
    <ContainersComponent>
      <TitleComponent
        title="User"
        routeName="user"
        isShowCreateButton
        createButtonOnClick={handleOpenModalForCreate}
      />
      <DataTableComponent
        data={users}
        fields={userFields}
        onEdit={(item) => handleOpenModalForEdit(item)}
        onDelete={(item) => handleDelete(item)}
        onSearchChange={handleSearchChange}
        isShowSearchBar
        actionType={['edit', 'delete']}
      />
      <PaginationButtons
        currentPage={page}
        totalPages={totalPages}
        onPrevPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editUser={editUser}
      />
    </ContainersComponent>
  );
};

export default UserPage;
