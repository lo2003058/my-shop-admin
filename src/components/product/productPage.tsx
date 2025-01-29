'use client';

import React, { useCallback, useEffect, useState } from 'react';
import TitleComponent from '@/components/common/titleComponent';
import ContainersComponent from '@/components/common/containersComponent';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS_PAGINATED } from '@/graphql/products/queries';
import { Product, ProductsData } from '@/types/product/types';
import LoadingComponent from '@/components/common/loadingComponent';
import DebugComponent from '@/components/common/debugComponent';
import { DataTableComponent, Field } from '@/components/common/dataTableComponent';
import PaginationButtons from '@/components/common/paginationButtons';

const fields: Field<Product>[] = [
  { name: 'ID', key: 'id', type: 'text' },
  { name: 'Name', key: 'name', type: 'text' },
  { name: 'Price', key: 'price', type: 'number' },
  { name: 'Stock', key: 'stock', type: 'number' },
  { name: 'Is virtual', key: 'isVirtual', type: 'boolean' },
  { name: 'Image', key: 'imageUrl', type: 'image' },
];

const ProductPage: React.FC = () => {

  // State
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 4;

  const { data, loading, error, refetch } = useQuery<ProductsData>(
    GET_PRODUCTS_PAGINATED,
    {
      variables: {
        page,
        pageSize,
        filter: { searchTerm },
      },
    },
  );

  // On data update
  useEffect(() => {
    if (data?.productsV2) {
      setProducts(data.productsV2.items);
      setTotalPages(data.productsV2.totalPages);
    }
  }, [data]);

  const goToNextPage = useCallback(() => {
    if (page >= totalPages) return;

    const newPage = page + 1;
    refetch({
      page: newPage,
      pageSize,
      filter: { searchTerm },
    })
      .then((res) => {
        if (res.data?.productsV2) {
          setProducts(res.data.productsV2.items);
          setTotalPages(res.data.productsV2.totalPages);
          setPage(newPage);
        }
      })
      .catch((err) => console.error('Error fetching next page:', err));
  }, [page, totalPages, pageSize, searchTerm, refetch]);

  const goToPreviousPage = useCallback(() => {
    if (page <= 1) return;

    const newPage = page - 1;
    refetch({
      page: newPage,
      pageSize,
      filter: { searchTerm },
    })
      .then((res) => {
        if (res.data?.productsV2) {
          setProducts(res.data.productsV2.items);
          setTotalPages(res.data.productsV2.totalPages);
          setPage(newPage);
        }
      })
      .catch((err) => console.error('Error fetching previous page:', err));
  }, [page, pageSize, searchTerm, refetch]);

  // Loading & Error
  if (loading && !products.length) {
    return (
      <ContainersComponent>
        <LoadingComponent />
      </ContainersComponent>
    );
  }

  if (error) {
    console.error(error);
    return (
      <>
        <ContainersComponent>
          <p className="text-red-500">Error loading products.</p>
        </ContainersComponent>
      </>
    );
  }

  return (
    <>
      <ContainersComponent>
        <TitleComponent
          title="Product"
          routeName={'product'}
          isShowCreateButton
        />
        <DataTableComponent
          data={products}
          fields={fields}
          onEdit={(data) => {
            alert(`Editing: ${data.name}`);
          }}
          onDelete={(data) => {
            alert(`Deleting: ${data.name}`);
          }}
          onView={(data) => {
            alert(`Viewing: ${data.name}`);
          }}
          onSearchChange={(value) => {
            setSearchTerm(value);
          }}
          isShowSearchBar
          actionType={['view']}
        />

        {/* Pagination */}
        <PaginationButtons
          currentPage={page}
          totalPages={totalPages}
          onPrevPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />

      </ContainersComponent>
    </>
  )
    ;
};

export default ProductPage;
