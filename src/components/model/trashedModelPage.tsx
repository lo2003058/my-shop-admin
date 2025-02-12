'use client';

import React, { useCallback, useState } from 'react';
import ContainersComponent from '@/components/common/containersComponent';
import TitleComponent from '@/components/common/titleComponent';
import { DataTableComponent } from '@/components/common/dataTableComponent';
import PaginationButtons from '@/components/common/paginationButtons';
import { useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';
import { GqlErrorMessage } from '@/types/error/types';
import { modelFields } from '@/config/tableFields';
import { Model, ModelsData } from '@/types/model/types';
import { GET_MODELS_PAGINATED } from '@/graphql/model/queries';
import { UPDATE_MODEL } from '@/graphql/model/mutation';

const TrashedModelPage: React.FC = () => {
  // For pagination & search
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Page size config
  const pageSize = 10;

  // GraphQL Query
  const { data, error, refetch } = useQuery<ModelsData>(
    GET_MODELS_PAGINATED,
    {
      variables: {
        page,
        pageSize,
        filter: {
          searchTerm: searchTerm,
          isShow: false,
        },
      },
      fetchPolicy: 'network-only',
    },
  );

  const [updateModel] = useMutation(UPDATE_MODEL);

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

  // Decide how to grab models and total pages
  const models = data?.paginatedModel?.items ?? [];
  const totalPages = data?.paginatedModel?.totalPages ?? 1;

  const handleRestore = async (formData: Model) => {
    try {
      await updateModel({
        variables: {
          input: {
            id: formData.id,
            isShow: true,
          },
        },
      }).then(async () => {
        await Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Product restore Successfully',
          text: 'Your product has been restored.',
          showConfirmButton: false,
          timer: 1500,
        });
      });
      refetch();
    } catch (err: unknown) {
      const error = err as GqlErrorMessage;
      // Extract error message
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        'An error occurred while restoring your product.';
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Product restore Error',
        text: errorMessage,
        timer: 1500,
      });
    }
  };

  return (
    <ContainersComponent>
      <TitleComponent
        title="Trashed product"
        isShowBackButton
      />
      <DataTableComponent
        data={models}
        fields={modelFields}
        onRestore={(item) => handleRestore(item)}
        onSearchChange={handleSearchChange}
        isShowSearchBar
        actionType={['restore']}
      />
      <PaginationButtons
        currentPage={page}
        totalPages={totalPages}
        onPrevPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
    </ContainersComponent>
  );
};

export default TrashedModelPage;
