'use client';

import React, { useCallback, useState } from 'react';
import TitleComponent from '@/components/common/titleComponent';
import ContainersComponent from '@/components/common/containersComponent';
import { DataTableComponent } from '@/components/common/dataTableComponent';
import { actionLogFields } from '@/config/tableFields';
import PaginationButtons from '@/components/common/paginationButtons';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client';
import { ActionLog, ActionLogData } from '@/types/action-log/types';
import { GET_ACTION_LOG_PAGINATED } from '@/graphql/action-log/queries';
import ActionLogViewModal from '@/components/action-log/view/actionLogViewModal';

const ActionLogPage: React.FC = () => {
  const { data: session } = useSession();
  const adminToken = session?.accessToken;

  // For pagination & search
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [actionLogItem, setActionLogItem] = useState<ActionLog | null>(null);

  // Page size config
  const pageSize = 10;

  // GraphQL Query
  const { data, error, refetch } = useQuery<ActionLogData>(
    GET_ACTION_LOG_PAGINATED,
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

  const handleOpenModalForView = (data: ActionLog) => {
    setActionLogItem(data);
    setViewModalOpen(true);
  };

  const goToNextPage = useCallback(() => {
    const totalPages = data?.paginatedActionLog?.totalPages ?? 1;
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

  const actionLogs = data?.paginatedActionLog?.items ?? [];
  const totalPages = data?.paginatedActionLog?.totalPages ?? 1;

  return (
    <ContainersComponent>
      <TitleComponent
        title="Action Log"
        routeName="action-log"
      />
      <DataTableComponent
        data={actionLogs}
        fields={actionLogFields}
        onSearchChange={handleSearchChange}
        onView={(item) => handleOpenModalForView(item)}
        isShowSearchBar
        actionType={['view']}
      />
      <PaginationButtons
        currentPage={page}
        totalPages={totalPages}
        onPrevPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
      <ActionLogViewModal
        isOpen={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        actionLogData={actionLogItem}
      />
    </ContainersComponent>
  );
};

export default ActionLogPage;
