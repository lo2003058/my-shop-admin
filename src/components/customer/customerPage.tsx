'use client';

import React, { useCallback, useState } from 'react';
import TitleComponent from '@/components/common/titleComponent';
import ContainersComponent from '@/components/common/containersComponent';
import { useMutation, useQuery } from '@apollo/client';
import { Customer, CustomersData } from '@/types/customer/types';
import { GET_CUSTOMERS_PAGINATED } from '@/graphql/Customer/queries';
import Swal from 'sweetalert2';
import PaginationButtons from '@/components/common/paginationButtons';
import { DataTableComponent } from '@/components/common/dataTableComponent';
import { customerFields } from '@/config/tableFields';
import { REMOVE_CUSTOMER } from '@/graphql/Customer/mutation';
import CustomerFormModal from '@/components/customer/form/customerFormModal';
import CustomerViewModal from '@/components/customer/view/customerViewModal';
import { useSession } from 'next-auth/react';

const CustomerPage: React.FC = () => {
  const { data: session } = useSession();

  const adminToken = session?.accessToken;

  // For pagination & search
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  // Page size config
  const pageSize = 10;

  // GraphQL Query
  const { data, error, refetch } = useQuery<CustomersData>(
    GET_CUSTOMERS_PAGINATED,
    {
      variables: {
        page,
        pageSize,
        filter: {
          searchTerm: searchTerm,
        },
      },
      fetchPolicy: 'network-only',
    },
  );

  const [removeCustomer] = useMutation(REMOVE_CUSTOMER);

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

  const handleCloseModal = () => {
    refetch().finally(() => {
      setModalOpen(false);
    });
  };

  const handleOpenModalForEdit = (data: Customer) => {
    setEditCustomer(data);
    setModalOpen(true);
  };

  const handleOpenModalForView = (data: Customer) => {
    setEditCustomer(data);
    setViewModalOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleDelete = async (item: Customer) => {
    await Swal.fire({
      title: 'Delete Customer',
      text: 'Are you sure you want to delete this customer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
        if (result.isConfirmed) {
          await removeCustomer({
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
                text: 'Customer has been deleted.',
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
    const totalPages = data?.paginatedCustomer?.totalPages ?? 1;
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
        <p className="text-red-500">Error loading customer.</p>
      </ContainersComponent>
    );
  }

  // Decide how to grab products and total pages
  const customers = data?.paginatedCustomer?.items ?? [];
  const totalPages = data?.paginatedCustomer?.totalPages ?? 1;

  return (
    <ContainersComponent>
      <TitleComponent
        title="Customer"
        routeName="customer"
      />
      <DataTableComponent
        data={customers}
        fields={customerFields}
        onEdit={(item) => handleOpenModalForEdit(item)}
        onDelete={(item) => handleDelete(item)}
        onView={(item) => handleOpenModalForView(item)}
        onSearchChange={handleSearchChange}
        isShowSearchBar
        actionType={['view', 'edit', 'delete']}
      />
      <PaginationButtons
        currentPage={page}
        totalPages={totalPages}
        onPrevPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editCustomer={editCustomer}
      />
      <CustomerViewModal
        isOpen={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        customerData={editCustomer}
      />
    </ContainersComponent>
  );
};

export default CustomerPage;
