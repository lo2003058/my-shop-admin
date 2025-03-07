'use client';

import React, { useCallback, useState } from 'react';
import ContainersComponent from '@/components/common/containersComponent';
import TitleComponent from '@/components/common/titleComponent';
import { useQuery } from '@apollo/client';
import { OrdersData } from '@/types/order/types';
import { GET_ORDERS_PAGINATED } from '@/graphql/order/queries';
import { Order } from '@/types/order/types';
import { DataTableComponent } from '@/components/common/dataTableComponent';
import { orderFields } from '@/config/tableFields';
import PaginationButtons from '@/components/common/paginationButtons';
import TabsComponent from '@/components/common/tabsComponent';
import { useRouter } from 'next/navigation';

const OrderPage: React.FC = () => {
  const router = useRouter();

  // For pagination & search
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatus, setOrderStatus] = useState<string>('all');

  // Page size config
  const pageSize = 10;

  const tabs = [
    {
      name: 'All',
      value: 'all',
      current: true,
    },
    {
      name: 'Pending',
      value: 'pending',
      current: false,
    },
    {
      name: 'Delivered',
      value: 'delivered',
      current: false,
    },
    {
      name: 'Completed',
      value: 'completed',
      current: false,
    },
    {
      name: 'Cancelled',
      value: 'cancelled',
      current: false,
    },
  ];

  // GraphQL Query
  const { data, error, refetch } = useQuery<OrdersData>(
    GET_ORDERS_PAGINATED,
    {
      variables: {
        page,
        pageSize,
        filter: {
          searchTerm: searchTerm,
          orderStatus: orderStatus,
        },
      },
      fetchPolicy: 'network-only',
    },
  );

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

  const handleView = (data: Order) => {
    router.push(`/order/view/${data.id}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const totalPages = data?.paginatedOrders?.totalPages ?? 1;

  const goToNextPage = useCallback(() => {
    if (page < totalPages) {
      refetchData(page + 1);
    }
  }, [page, totalPages, refetchData]);

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
        <p className="text-red-500">Error loading order.</p>
      </ContainersComponent>
    );
  }

  // Decide how to grab products and total pages
  const orders = data?.paginatedOrders?.items ?? [];

  return (
    <ContainersComponent>
      <TitleComponent
        title="Order"
        routeName="order"
      />
      <TabsComponent
        tabs={tabs}
        onTabChange={setOrderStatus}
      />
      <DataTableComponent
        data={orders}
        fields={orderFields}
        onView={(item) => handleView(item)}
        onSearchChange={handleSearchChange}
        isShowSearchBar
        actionType={['view']}
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

export default OrderPage;
