'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ORDER } from '@/graphql/order/queries';
import TitleComponent from '@/components/common/titleComponent';
import LoadingComponent from '@/components/common/loadingComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faCreditCard,
  faShoppingBag,
  faUser,
  faMapMarkerAlt,
  faCheckCircle,
  faTag,
  faInfoCircle,
  faCrown,
  faCoins, faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import Image from 'next/image';
import { OrderProduct } from '@/types/order/types';
import { Disclosure } from '@headlessui/react';
import SelectMenu from '@/components/common/selectMenu';
import { UPDATE_ORDER } from '@/graphql/order/mutation';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { useSession } from 'next-auth/react';

const OrderViewPage: React.FC = () => {
  const { data: session } = useSession();
  const adminToken = session?.accessToken;
  const { id } = useParams();
  const pathname = usePathname().split('/')[1];

  const { data, loading, error, refetch } = useQuery(GET_ORDER, {
    variables: { id: parseInt(id as string) },
    context: {
      headers: { 'authorization-admin': `Bearer ${adminToken}` },
    },
    skip: !id || !adminToken,
  });

  const [updateOrderStatus] = useMutation(UPDATE_ORDER);

  if (loading) return <LoadingComponent />;

  if (error)
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faInfoCircle} className="text-red-500 text-xl mr-3" />
            <p className="text-red-700">Error: {error.message}</p>
          </div>
        </div>
      </div>
    );

  const order = data?.order;

  // Calculate subtotal
  const subtotal = order?.orderProduct.reduce(
    (sum: number, item: { product: { price: number; }; quantity: number; }) => sum + item.product.price * item.quantity,
    0,
  );

  const statusOptions = [
    {
      label: 'Pending',
      value: 'pending',
    },
    {
      label: 'Delivered',
      value: 'delivered',
    },
    {
      label: 'Completed',
      value: 'completed',
    },
    {
      label: 'Cancelled',
      value: 'cancelled',
    },
  ];

  const handleStatusChange = async (status: string) => {
    await updateOrderStatus({
      variables: {
        input: {
          id: order.id,
          status,
        },
      },
      context: {
        headers: { 'authorization-admin': `Bearer ${adminToken}` },
      },
    }).then(async () => {
      await Swal.fire({
        position: 'center',
        icon: 'success',
        title: `${_.capitalize(pathname)} status updated successfully`,
        text: `Your ${pathname.toLowerCase()} status has been updated.`,
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    });
  };

  const discount = order?.payment?.paymentResponse ? JSON.parse(order?.payment?.paymentResponse).total_details?.amount_discount / 100 : 0;

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <TitleComponent
        title="Order Details"
        routeName="order"
        isShowBackButton
      />

      {/* Order Summary Header */}
      <div className="bg-white shadow-sm rounded-lg p-6 my-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800">Order #{order?.id}</h1>
            <p className="text-gray-500">
              {`Placed on ${moment(order?.createdAt).format('DD MMMM YYYY - HH:mm:ss')}`}</p>
            <p className="text-gray-500">
              {`Order updated at ${moment(order?.updatedAt).format('DD MMMM YYYY - HH:mm:ss')}`}</p>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-sm text-gray-500">Status</span>
            </div>
            <div className={`pb-2 min-w-40`}>
              <SelectMenu
                items={statusOptions}
                labelName={`label`}
                labelValue={`value`}
                value={order?.status}
                onChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Products + Payment) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products List */}
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faShoppingBag} className="text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Items</h2>
            </div>

            <div className="divide-y divide-gray-100">
              {order?.orderProduct.map((item: OrderProduct, index: number) => (
                <div key={index} className="py-4 flex">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.product.imageUrl || '/images/no-image-available.webp'}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-32 h-32 object-cover rounded-md border border-gray-200"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {item.product.isVirtual ? 'Digital Product' : 'Physical Product'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="font-semibold text-gray-800">${(item.product.price * item.quantity).toFixed(2)}</p>
                        <p className="text-gray-500 text-sm mt-1">
                          ${item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <FontAwesomeIcon icon={faTag} className="mr-1.5 text-gray-500" />
                        ID: {item.product.id}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <Disclosure as="div">
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faCreditCard} className="text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium text-gray-800 capitalize">{order?.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium capitalize ${
                    order?.payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                  {order?.payment.status}
                </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-800">
                  {moment(order?.payment.createdAt).format(
                    'DD MMMM YYYY - HH:mm:ss',
                  )}
                </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-medium text-gray-800 text-sm">
                  {order?.payment.paymentIntentId}
                </span>
                </div>
              </div>

              <div className="flex justify-center my-4">
                <Disclosure.Button className="text-blue-600 hover:text-blue-800 font-medium">
                  {({ open }) => (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`${open ? 'transform rotate-180' : 'transform rotate-0'} inline-block`}
                    />
                  )}
                </Disclosure.Button>
              </div>

              <Disclosure.Panel
                transition
                className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 text-gray-700 mt-2 p-4 bg-gray-50 rounded-md border border-gray-200"
              >
                <div>
                  <span className="font-medium text-gray-600">Payment response:</span>
                  <pre className="mt-2 p-3 bg-gray-100 rounded-2xl text-sm text-gray-700 overflow-x-auto">
                        {order?.payment.paymentResponse && JSON.stringify(
                          JSON.parse(order?.payment.paymentResponse),
                          null,
                          2,
                        )}
                  </pre>
                </div>
              </Disclosure.Panel>
            </div>
          </Disclosure>


        </div>

        {/* Right Column (Summary, Customer Info, Shipping Address) */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-3 border-b border-gray-100 pb-3 mb-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal && subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span>${order?.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${order?.tax.toFixed(2)}</span>
              </div>
            </div>

            {
              discount > 0 ? (
                <div className="space-y-3 border-b border-gray-100 pb-3 mb-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Original Price</span>
                    <span className="line-through">
                      ${(order?.total + discount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span>
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-800">
                    <span>Total</span>
                    <span>
                      ${order?.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between font-bold text-lg text-gray-800">
                  <span>Total</span>
                  <span>
                    ${order?.total.toFixed(2)}
                  </span>
                </div>
              )
            }


            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center text-green-600">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                <span>Points Earned: {order?.pointsEarned} point</span>
              </div>
            </div>
          </div>

          {/* Customer Information with Tier and Points */}
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faUser} className="text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Customer</h2>
            </div>

            <div className="space-y-5">
              {/* Customer Basic Info */}
              <div className="flex items-center pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">
                    {order?.customer.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <span className="block font-medium text-gray-800">Customer ID: {order?.customer.id}</span>
                  <span className="block text-gray-600">{order?.customer.email}</span>
                </div>
              </div>

              {/* Customer Tier */}
              {order?.customer.tier && (
                <div className="flex items-center pb-4 border-b border-gray-100">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faCrown} className="text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <span className="block text-sm text-gray-500">Membership Tier</span>
                    <span className="block font-medium text-gray-800">
                      {order?.customer.tier.name} (ID: {order?.customer.tier.id})
                    </span>
                  </div>
                </div>
              )}

              {/* Customer Points */}
              {order?.customer.customerPoints && (
                <div>
                  <div className="flex items-center mb-3">
                    <FontAwesomeIcon icon={faCoins} className="text-yellow-500 mr-2" />
                    <span className="text-gray-700 font-medium">Loyalty Points</span>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Balance</span>
                      <span className="font-medium text-gray-800">
                        {order?.customer.customerPoints.currentPoints} points
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accumulated (Period)</span>
                      <span className="font-medium text-gray-800">
                        {order?.customer.customerPoints.accumulatedPoints} points
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lifetime Total</span>
                      <span className="font-medium text-gray-800">
                        {order?.customer.customerPoints.totalAccumulatedPoints} points
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-gray-800">{order?.orderAddress.name}</p>
              <p className="text-gray-600">{order?.orderAddress.address}</p>
              {order?.orderAddress.address2 && <p className="text-gray-600">{order?.orderAddress.address2}</p>}
              <p className="text-gray-600">
                {order?.orderAddress.city}, {order?.orderAddress.state} {order?.orderAddress.zipCode}
              </p>
              <p className="text-gray-600">{order?.orderAddress.country}</p>
              <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                <FontAwesomeIcon icon={faPhone} className="text-gray-500 mr-2" />
                <span className="text-gray-700">{order?.orderAddress.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderViewPage;
