import React, { useState } from 'react';
import { CustomerViewProps, EditAddressData, GetCustomerAddress } from '@/types/customer/types';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CUSTOMER_ADDRESSES,
  UPDATE_CUSTOMER_DEFAULT_ADDRESS,
  REMOVE_CUSTOMER_ADDRESS,
} from '@/graphql/customer/queries';
import LoadingComponent from '@/components/common/loadingComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faMapPin, faPen, faPhone, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@headlessui/react';
import AddressFormModal from '@/components/customer/view/addressFormModal';
import Swal from 'sweetalert2';
import { GqlErrorMessage } from '@/types/error/types';
import Tooltip from '@/components/common/tooltip';
import { useSession } from 'next-auth/react';


const CustomerAddress: React.FC<CustomerViewProps> = ({ customerData = {} }) => {
  const { data: session } = useSession();
  const adminToken = session?.accessToken;

  const [isModalOpen, setModalOpen] = useState(false);

  const [editAddress, setEditAddress] = useState<EditAddressData | null>(null);

  const { data, loading, error, refetch } = useQuery<GetCustomerAddress>(
    GET_CUSTOMER_ADDRESSES,
    {
      variables: { customerId: customerData.id },
      fetchPolicy: 'network-only',
    },
  );

  const [updateCustomerDefaultAddress] = useMutation(UPDATE_CUSTOMER_DEFAULT_ADDRESS);

  const [deleteCustomerAddress] = useMutation(REMOVE_CUSTOMER_ADDRESS);

  const handleOpenModalForCreate = () => {
    setEditAddress(null);
    setModalOpen(true);
  };

  const handleOpenModalForEdit = (addr: EditAddressData) => {
    setEditAddress(addr);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    refetch().finally(() => setModalOpen(false));
  };

  const handleUpdateDefaultAddress = async (addressId: number) => {
    try {
      await updateCustomerDefaultAddress({
        variables: {
          addressId: addressId,
          customerId: customerData.id,
        },
        context: {
          headers: { 'authorization-admin': `Bearer ${adminToken}` },
        },
      })
        .then(async () => {
          await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Default Address Updated',
            text: 'Your default address has been updated.',
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .finally(() => {
          refetch(); // or any other state update needed
        });
    } catch (err: unknown) {
      // Safely narrow 'err' to GqlErrorMessage
      const error = err as GqlErrorMessage;

      // Extract error message
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        'An error occurred while updating your default address.';

      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Update Default Address Error',
        text: errorMessage,
        timer: 1500,
      });
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await Swal.fire({
        title: 'Delete Address',
        text: 'Are you sure you want to delete this address?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: 'red',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteCustomerAddress({
            variables: {
              id: addressId,
            },
            context: {
              headers: { 'authorization-admin': `Bearer ${adminToken}` },
            },
          })
            .then(async () => {
              await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Address Deleted Successfully',
                text: 'Your address has been removed.',
                showConfirmButton: false,
                timer: 1500,
              });
            })
            .finally(() => {
              refetch(); // or any other state update needed
            });
        }
      });
    } catch (err: unknown) {
      // Safely narrow 'err' to GqlErrorMessage
      const error = err as GqlErrorMessage;

      // Extract error message
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        'An error occurred while deleting your address.';

      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Delete Address Error',
        text: errorMessage,
        timer: 1500,
      });
    }
  };

  if (loading) return <LoadingComponent />;

  if (error) return <p>Error: {error.message}</p>;

  const customerAddress = data?.customerAddress;

  return (
    <>
      {customerAddress && customerAddress.length > 0 ? (
        <div className="space-y-4">
          {customerAddress.map((address) => (
            <div
              key={address.id}
              className="relative border border-gray-200 shadow-sm rounded-lg p-4 bg-white"
            >
              {/* Top-right buttons */}
              <div
                className="absolute top-2 right-2 flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
                {/* Not default => Show 'Set to default' */}
                {!address.isDefault && (
                  <Tooltip text="Set to default">
                    <div
                      className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleUpdateDefaultAddress(address.id)}
                    >
                      <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                        <FontAwesomeIcon icon={faMapPin} />
                      </Button>
                    </div>
                  </Tooltip>
                )}

                {/* Edit button */}
                <Tooltip text="Edit">
                  <div
                    className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOpenModalForEdit(address)}
                  >
                    <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                  </div>
                </Tooltip>

                {/* Delete button (hidden if there's only one address or if it's default) */}
                {customerAddress.length > 1 && !address.isDefault && (
                  <Tooltip text="Delete">
                    <div
                      className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </Tooltip>
                )}
              </div>

              {/* Main Address Info */}
              <div className="mb-2">
                <div className="mb-2 flex flex-wrap items-center text-lg font-semibold text-gray-800">
                  {/* Full Name */}
                  <span className="mr-2">
                    {address.firstName} {address.lastName}
                  </span>

                  {/* Default Address Badge */}
                  {address.isDefault && (
                    <span
                      className="mr-2 inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      <svg
                        viewBox="0 0 6 6"
                        aria-hidden="true"
                        className="h-1.5 w-1.5 fill-blue-500"
                      >
                        <circle r={3} cx={3} cy={3} />
                      </svg>
                      Default Address
                    </span>
                  )}

                  {/* Tag Badge */}
                  {address.tag && (
                    <span
                      className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      <svg
                        viewBox="0 0 6 6"
                        aria-hidden="true"
                        className="h-1.5 w-1.5 fill-green-500"
                      >
                        <circle r={3} cx={3} cy={3} />
                      </svg>
                      {address.tag}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-700 mt-3 space-y-3">
                {/* Phone Row */}
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-blue-500" />
                  <p>
                    <span className="font-semibold">Phone:</span>{' '}
                    {JSON.parse(address.countryCode).root} {address.phone}
                  </p>
                </div>

                {/* Address Block */}
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mt-0.5 text-green-500"
                  />
                  <div>
                    <p>
                      <span className="font-semibold">Address:</span>{' '}
                      {address.address2 ? `${address.address2}-` : ``}
                      {address.address}
                    </p>
                    <p>
                      {address.city}, {address.state}, {address.country} -{' '}
                      {address.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No addresses => show the placeholder + Add button */
        <div className="flex flex-col items-center justify-center mt-20">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No address found.
          </h3>
          <Button
            onClick={handleOpenModalForCreate}
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition-colors duration-300"
          >
            Add address
          </Button>
        </div>
      )}

      {/* AddressFormModal with create/edit mode */}
      <AddressFormModal
        customerId={customerData.id}
        existingAddressesCount={customerAddress?.length || 0}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editAddress={editAddress} // if null => create mode, if has data => edit mode
      />
    </>
  );
};

export default CustomerAddress;
