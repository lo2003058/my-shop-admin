'use client';

import React, { useCallback, useState } from 'react';
import TitleComponent from '@/components/common/titleComponent';
import ContainersComponent from '@/components/common/containersComponent';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS_PAGINATED } from '@/graphql/products/queries';
import { EditProductData, Product, ProductsData } from '@/types/product/types';
import { DataTableComponent } from '@/components/common/dataTableComponent';
import PaginationButtons from '@/components/common/paginationButtons';
import ProductFormModal from '@/components/product/form/productFormModal';
import { REMOVE_PRODUCT } from '@/graphql/products/mutation';
import Swal from 'sweetalert2';
import ProductViewModal from '@/components/product/view/productViewModal';
import { productFields } from '@/config/tableFields';
import { useSession } from 'next-auth/react';

const ProductPage: React.FC = () => {
  const { data: session } = useSession();

  const adminToken = session?.accessToken;

  // For pagination & search
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
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
        },
      },
      fetchPolicy: 'network-only',
    },
  );

  const [removeProduct] = useMutation(REMOVE_PRODUCT);

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
      setViewModalOpen(false);
    });
  };

  const handleOpenModalForCreate = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const handleOpenModalForEdit = (data: EditProductData) => {
    setEditProduct(data);
    setModalOpen(true);
  };

  const handleOpenModalForView = (data: EditProductData) => {
    setEditProduct(data);
    setViewModalOpen(true);
  };

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
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

  const handleDelete = async (item: Product) => {
    await Swal.fire({
      title: 'Delete Product',
      text: 'Are you sure you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
        if (result.isConfirmed) {
          await removeProduct({
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
                text: 'Product has been deleted.',
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
        title="Product"
        routeName="product"
        isShowCreateButton
        isShowTrashedButton
        createButtonOnClick={handleOpenModalForCreate}
      />
      <DataTableComponent
        data={products}
        fields={productFields}
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
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editProduct={editProduct}
      />
      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        productData={editProduct}
      />
    </ContainersComponent>
  );
};

export default ProductPage;
