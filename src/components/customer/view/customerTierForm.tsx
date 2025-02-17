import React, { useState } from 'react';
import SelectMenu from '@/components/common/selectMenu';
import { Tier } from '@/types/tier/types';

interface CustomerTierFormProps {
  tiersData: Tier[];
  currentTierId: number;
  updateTier: (tierId: number) => void;
}

const CustomerTierForm: React.FC<CustomerTierFormProps> = (
  {
    tiersData,
    currentTierId,
    updateTier,
  },
) => {
  const [selectedTierId, setSelectedTierId] = useState<number | null>(
    currentTierId || null,
  );

  const handleUpdateTier = (tierId: number) => {
    setSelectedTierId(tierId);
    updateTier(tierId);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">Current Tier</p>
        </div>
      </div>
      <SelectMenu
        items={tiersData}
        labelName="name"
        labelValue="id"
        value={selectedTierId}
        onChange={(id) => {
          handleUpdateTier(id);
        }}
        placeholder="Select a tier"
      />
    </>
  );
};

export default CustomerTierForm;
