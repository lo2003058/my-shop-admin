'use client';

import React, { useState } from 'react';
import TitleComponent from '@/components/common/titleComponent';
import ContainersComponent from '@/components/common/containersComponent';
import { DataTableComponent } from '@/components/common/dataTableComponent';
import { tierFields } from '@/config/tableFields';
import { useQuery } from '@apollo/client';
import { Tier, TiersData } from '@/types/tier/types';
import { GET_TIERS } from '@/graphql/tier/queries';
import LoadingComponent from '@/components/common/loadingComponent';
import { useSession } from 'next-auth/react';
import TierFormModal from '@/components/tier/form/tierFormModal';

const TierPage: React.FC = () => {
  const { data: session } = useSession();

  const adminToken = session?.accessToken;

  const [isModalOpen, setModalOpen] = useState(false);
  const [editTier, setEditTier] = useState<Tier | null>(null);

  // GraphQL Query
  const { data, loading, error, refetch } = useQuery<TiersData>(GET_TIERS);

  if (loading) return <LoadingComponent />;

  // If error, show it, but keep the table unmounted
  if (error) {
    console.error(error);
    return (
      <ContainersComponent>
        <p className="text-red-500">Error loading model.</p>
      </ContainersComponent>
    );
  }

  const handleCloseModal = () => {
    refetch().finally(() => {
      setModalOpen(false);
    });
  };

  const handleOpenModalForEdit = (data: Tier) => {
    setEditTier(data);
    setModalOpen(true);
  };

  // Decide how to grab products and total pages
  const tiers = data?.tiers ?? [];

  return (
    <ContainersComponent>
      <TitleComponent
        title="Tier"
        routeName="tier"
      />
      <DataTableComponent
        data={tiers}
        fields={tierFields}
        onEdit={(item) => handleOpenModalForEdit(item)}
        isShowSearchBar={false}
        actionType={['edit']}
      />
      <TierFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editTier={editTier}
      />
    </ContainersComponent>
  );
};

export default TierPage;
