'use client';

import React, { useCallback, useState } from 'react';
import ContainersComponent from '@/components/common/containersComponent';
import TitleComponent from '@/components/common/titleComponent';
import { DataTableComponent } from '@/components/common/dataTableComponent';
import PaginationButtons from '@/components/common/paginationButtons';
import { EditProductData, Product, ProductsData } from '@/types/product/types';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS_PAGINATED } from '@/graphql/products/queries';
import Swal from 'sweetalert2';
import { GqlErrorMessage } from '@/types/error/types';
import { UPDATE_PRODUCT } from '@/graphql/products/mutation';
import ProductViewModal from '@/components/product/view/productViewModal';
import { productFields } from '@/config/tableFields';
import { useSession } from 'next-auth/react';

const TrashedProductPage: React.FC = () => {
  const { data: session } = useSession();

  const adminToken = session?.accessToken;

  // For pagination & search
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<EditProductData | null>(null);

  // Page size config
  const pageSize = 10;

  // GraphQL Query
  const { data, error, refetch } = useQuery<ProductsData>(
    GET_PRODUCTS_PAGINATED,
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

  const [updateProduct] = useMutation(UPDATE_PRODUCT);

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

  const handleOpenModalForView = (data: EditProductData) => {
    setEditProduct(data);
    setViewModalOpen(true);
  };

  const goToNextPage = useCallback(() => {
    const totalPages = data?.productsV2?.totalPages ?? 1;
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
        <p className="text-red-500">Error loading products.</p>
      </ContainersComponent>
    );
  }

  // Decide how to grab products and total pages
  const products = data?.productsV2?.items ?? [];
  const totalPages = data?.productsV2?.totalPages ?? 1;

  const handleRestore = async (formData: Product) => {
    try {
      await updateProduct({
        variables: {
          input: {
            id: formData.id,
            isShow: true,
          },
        },
        context: {
          headers: { 'authorization-admin': `Bearer ${adminToken}` },
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
        data={products}
        fields={productFields}
        onView={(item) => handleOpenModalForView(item)}
        onRestore={(item) => handleRestore(item)}
        onSearchChange={handleSearchChange}
        isShowSearchBar
        actionType={['view', 'restore']}
      />
      <PaginationButtons
        currentPage={page}
        totalPages={totalPages}
        onPrevPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        productData={editProduct}
      />
    </ContainersComponent>
  );
};

export default TrashedProductPage;
