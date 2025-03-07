import React from 'react';
import { CustomerViewProps } from '@/types/customer/types';
import { useQuery } from '@apollo/client';
import { GET_CUSTOMER_ORDERS } from '@/graphql/customer/queries';
import LoadingComponent from '@/components/common/loadingComponent';
import { Order } from '@/types/order/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faCalendarAlt,
  faCreditCard,
  faDollarSign,
  faMapMarkerAlt,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import Link from 'next/link';


const CustomerOrders: React.FC<CustomerViewProps> = ({ customerData = {} }) => {

  const { data, loading, error } = useQuery(GET_CUSTOMER_ORDERS, {
    variables: { id: customerData.id },
  });

  if (loading) return <LoadingComponent />;
  if (error) return <p className={`text-gray-700`}>Error: {error.message}</p>;

  const orders = data?.customer.order;

  return (
    <>
      <div className={`text-gray-700`}>
        {orders && orders.length > 0 ? (
          <>
            <div className="space-y-4">
              {orders.map((order: Order) => (
                <div
                  key={order.id}
                  className="relative border border-gray-200 shadow-sm rounded-lg p-4 bg-white"
                >
                  {/* Main Order Information */}
                  <div className="mb-2">
                    <div className="mb-2 flex flex-wrap items-center text-lg font-semibold text-gray-800">
                      <Link
                        href={`/order/view/${order.id}`}
                        className="mr-2 hover:underline"
                      >
                        Order #{order.id}
                      </Link>
                      {order.status && (
                        <span
                          className={`mr-2 inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                            order.status.toLowerCase() === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status.toLowerCase() === 'delivered'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 mt-3 space-y-3">
                    {/* Order Date */}
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-blue-500"
                      />
                      <p>
                        <span className="font-semibold">Date:</span>{' '}
                        {moment(order.createdAt).format(
                          'DD MMMM YYYY - HH:mm:ss',
                        )}
                      </p>
                    </div>

                    {/* Order Total */}
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="text-green-500"
                      />
                      <p>
                        <span className="font-semibold">Total:</span> $
                        {order.total}
                      </p>
                    </div>

                    {/* Tax and Shipping Fee */}
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faReceipt}
                        className="text-gray-500"
                      />
                      <p>
                        <span className="font-semibold">Tax:</span> ${order.tax}{' '}
                        <span className="mx-2">|</span>{' '}
                        <span className="font-semibold">Shipping:</span> $
                        {order.shippingFee}
                      </p>
                    </div>

                    {/* Payment Information */}
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCreditCard}
                        className="text-purple-500"
                      />
                      <div>
                        <span className="font-semibold">Payment:</span>{' '}
                        <div className={`capitalize`}>
                          {order.payment?.method} ({order.payment?.status})
                        </div>
                      </div>
                    </div>

                    {/* Order Products */}
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faBoxOpen}
                        className="mt-0.5 text-indigo-500"
                      />
                      <div>
                        <span className="font-semibold">Products:</span>
                        <ul className="list-disc list-inside">
                          {order.orderProduct.map((item, index) => (
                            <li key={index}>
                              {item.product.name}{` `}x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-green-500"
                      />
                      <div>
                        <p>
                          <span className="font-semibold">
                            Shipping Address:
                          </span>{' '}
                          {order.orderAddress.address2
                            ? `${order.orderAddress.address2} - `
                            : ''}
                          {order.orderAddress.address},{' '}
                          {order.orderAddress.city}, {order.orderAddress.state},{' '}
                          {order.orderAddress.country} -{' '}
                          {order.orderAddress.zipCode}
                        </p>
                        <p>
                          <span className="font-semibold">Name:</span>{' '}
                          {order.orderAddress.name}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{' '}
                          {order.orderAddress.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Customer has no orders
            </h3>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerOrders;
