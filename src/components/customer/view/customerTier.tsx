import React from 'react';
import { CustomerViewProps } from '@/types/customer/types';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CUSTOMER_TIER } from '@/graphql/Customer/queries';
import LoadingComponent from '@/components/common/loadingComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import CustomerTierForm from '@/components/customer/view/customerTierForm';
import { UPDATE_CUSTOMER } from '@/graphql/Customer/mutation';
import Swal from 'sweetalert2';
import { GET_TIERS } from '@/graphql/tier/queries';
import { Tier } from '@/types/tier/types';


const CustomerTier: React.FC<CustomerViewProps> = ({ customerData = {} }) => {
  const {
    data: customerTierData,
    loading: customerTierloading,
    error: customerTierError,
    refetch,
  } = useQuery(GET_CUSTOMER_TIER, {
    variables: { id: customerData.id },
  });
  const { data: tiersData, loading: tierloading, error: tierError } = useQuery(GET_TIERS);


  const [updateCustomerTier] = useMutation(UPDATE_CUSTOMER);

  if (customerTierloading || tierloading) return <LoadingComponent />;
  if (customerTierError) return <div>Error: {customerTierError.message}</div>;
  if (tierError) return <div>Error: {tierError.message}</div>;

  // This function will be called when a new tier is selected.
  const handleRefetch = async (tierId: number) => {
    await updateCustomerTier({
      variables: {
        input: {
          id: customerData.id,
          tierId: tierId,
        },
      },
    }).then(async () => {
      await Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Membership Tier Updated Successfully',
        showConfirmButton: false,
        timer: 1500,
      }).finally(() => {
        // Refetch the data
        refetch();
      });
    });
  };

  const customerTier = customerTierData?.customer.tier || {};
  const tiers = tiersData?.tiers || [];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">Membership Tier</h2>
            <div className="bg-amber-50 rounded-lg p-2">
              <FontAwesomeIcon icon={faCrown} className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="p-6 border-b">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-4">Tier Information</p>
              <ul role="list" className="divide-y divide-gray-100">
                {tiers.map((tier: Tier) => (
                  <li key={tier.id} className="py-4">
                    <div className="flex items-center gap-x-3">
                      <h3 className="flex-auto truncate text-sm font-semibold text-gray-900">
                        {tier.name}
                      </h3>
                      <span className="flex-none text-xs text-gray-500">
                  {tier.requiredPoints} pts
                </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <CustomerTierForm
                tiersData={tiers}
                currentTierId={customerTier?.id}
                updateTier={handleRefetch}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerTier;
