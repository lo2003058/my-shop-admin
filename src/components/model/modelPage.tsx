'use client';

import React, { useCallback, useState } from 'react';
import TitleComponent from '@/components/common/titleComponent';
import ContainersComponent from '@/components/common/containersComponent';
import { useMutation, useQuery } from '@apollo/client';
import { Model, PaginatedModelsData } from '@/types/model/types';
import { GET_MODELS_PAGINATED } from '@/graphql/model/queries';
import { REMOVE_MODEL } from '@/graphql/model/mutation';
import { DataTableComponent } from '@/components/common/dataTableComponent';
import { modelFields } from '@/config/tableFields';
import PaginationButtons from '@/components/common/paginationButtons';
import Swal from 'sweetalert2';
import ModelFormModal from '@/components/model/form/modelFormModal';
import { useSession } from 'next-auth/react';

const ModelPage: React.FC = () => {
  const { data: session } = useSession();

  const adminToken = session?.accessToken;

  // For pagination & search
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editModel, setEditModel] = useState<Model | null>(null);

  // Page size config
  const pageSize = 10;

  // GraphQL Query
  const { data, error, refetch } = useQuery<PaginatedModelsData>(
    GET_MODELS_PAGINATED,
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

  const [removeModel] = useMutation(REMOVE_MODEL);

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

  const handleOpenModalForCreate = () => {
    setEditModel(null);
    setModalOpen(true);
  };

  const handleOpenModalForEdit = (data: Model) => {
    setEditModel(data);
    setModalOpen(true);
  };

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const goToNextPage = useCallback(() => {
    const totalPages = data?.paginatedModel?.totalPages ?? 1;
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
  const models = data?.paginatedModel?.items ?? [];
  const totalPages = data?.paginatedModel?.totalPages ?? 1;

  const handleDelete = async (item: Model) => {
    await Swal.fire({
      title: 'Delete Model',
      text: 'Are you sure you want to delete this model?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
        if (result.isConfirmed) {
          await removeModel({
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
                text: 'Model has been deleted.',
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

  return (
    <ContainersComponent>
      <TitleComponent
        title="Model"
        routeName="model"
        isShowCreateButton
        createButtonOnClick={handleOpenModalForCreate}
        isShowTrashedButton
      />
      <DataTableComponent
        data={models}
        fields={modelFields}
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
      <ModelFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editModel={editModel}
      />
    </ContainersComponent>
  );
};

export default ModelPage;
