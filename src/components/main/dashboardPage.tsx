'use client';

import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleUp,
  faArrowsToCircle,
  faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/**
 * Utility function to concatenate class names conditionally.
 * @param classes - Array of class names, booleans, or undefined.
 * @returns A string of concatenated class names.
 */
function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/** Type Definitions */

/** Navigation item structure */
interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

/** Statistic item structure */
interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

/** Possible statuses */
type Status = 'Paid' | 'Withdraw' | 'Overdue';

/** Transaction structure */
interface Transaction {
  id: number;
  invoiceNumber: string;
  href: string;
  amount: string;
  tax?: string;
  status: Status;
  client: string;
  description: string;
  icon: IconDefinition; // FontAwesome icon
}

/** Day structure containing transactions */
interface Day {
  date: string;
  dateTime: string;
  transactions: Transaction[];
}

/** Data Definitions */

const secondaryNavigation: NavigationItem[] = [
  { name: 'Last 7 days', href: '#', current: true },
  { name: 'Last 30 days', href: '#', current: false },
  { name: 'All-time', href: '#', current: false },
];

const stats: Stat[] = [
  { name: 'Revenue', value: '$405,091.00', change: '+4.75%', changeType: 'positive' },
  { name: 'Overdue invoices', value: '$12,787.00', change: '+54.02%', changeType: 'negative' },
  { name: 'Outstanding invoices', value: '$245,988.00', change: '-1.39%', changeType: 'positive' },
  { name: 'Expenses', value: '$30,156.00', change: '+10.18%', changeType: 'negative' },
];

const statuses: Record<Status, string> = {
  Paid: 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
};

const days: Day[] = [
  {
    date: 'Today',
    dateTime: '2023-03-22',
    transactions: [
      {
        id: 1,
        invoiceNumber: '00012',
        href: '#',
        amount: '$7,600.00 USD',
        tax: '$500.00',
        status: 'Paid',
        client: 'Reform',
        description: 'Website redesign',
        icon: faArrowCircleUp, // Replaced ArrowUpCircleIcon
      },
      {
        id: 2,
        invoiceNumber: '00011',
        href: '#',
        amount: '$10,000.00 USD',
        status: 'Withdraw',
        client: 'Tom Cook',
        description: 'Salary',
        icon: faArrowsToCircle, // Replaced ArrowDownCircleIcon
      },
      {
        id: 3,
        invoiceNumber: '00009',
        href: '#',
        amount: '$2,000.00 USD',
        tax: '$130.00',
        status: 'Overdue',
        client: 'Tuple',
        description: 'Logo design',
        icon: faArrowsRotate, // Replaced ArrowPathIcon
      },
    ],
  },
  {
    date: 'Yesterday',
    dateTime: '2023-03-21',
    transactions: [
      {
        id: 4,
        invoiceNumber: '00010',
        href: '#',
        amount: '$14,000.00 USD',
        tax: '$900.00',
        status: 'Paid',
        client: 'SavvyCal',
        description: 'Website redesign',
        icon: faArrowCircleUp, // Replaced ArrowUpCircleIcon
      },
    ],
  },
];


/** DashboardPage Component */

const DashboardPage: React.FC = () => {
  return (
    <div className="bg-white h-screen">
      <div className="relative isolate overflow-hidden pt-16">
        {/* Secondary navigation */}
        <header className="pb-4 pt-6 sm:pb-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <h1 className="text-base/7 font-semibold text-gray-900">Cashflow</h1>
            <div
              className="order-last flex w-full gap-x-8 text-sm/6 font-semibold sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:text-sm/7">
              {secondaryNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(item.current ? 'text-indigo-600' : 'text-gray-700')}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
          <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
            {stats.map((stat, statIdx) => (
              <div
                key={stat.name}
                className={classNames(
                  statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
                  'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8',
                )}
              >
                <dt className="text-sm/6 font-medium text-gray-500">{stat.name}</dt>
                <dd
                  className={classNames(
                    stat.changeType === 'negative' ? 'text-rose-600' : 'text-gray-700',
                    'text-xs font-medium',
                  )}
                >
                  {stat.change}
                </dd>
                <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Decorative Gradient */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
        >
          <div
            style={{
              clipPath:
                'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
            }}
            className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
          />
        </div>
      </div>

      <div className="space-y-16 py-16 xl:space-y-20">
        {/* Recent activity table */}
        <div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mx-auto max-w-2xl text-base font-semibold text-gray-900 lg:mx-0 lg:max-w-none">
              Recent activity
            </h2>
          </div>
          <div className="mt-6 overflow-hidden border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                <table className="w-full text-left">
                  <thead className="sr-only">
                  <tr>
                    <th>Amount</th>
                    <th className="hidden sm:table-cell">Client</th>
                    <th>More details</th>
                  </tr>
                  </thead>
                  <tbody>
                  {days.map((day) => (
                    <Fragment key={day.dateTime}>
                      <tr className="text-sm/6 text-gray-900">
                        <th scope="colgroup" colSpan={3} className="relative isolate py-2 font-semibold">
                          <time dateTime={day.dateTime}>{day.date}</time>
                          <div
                            className="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-200 bg-gray-50"
                          />
                          <div
                            className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-gray-200 bg-gray-50"
                          />
                        </th>
                      </tr>
                      {day.transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="relative py-5 pr-6">
                            <div className="flex gap-x-6">
                              <FontAwesomeIcon
                                icon={transaction.icon}
                                aria-hidden="true"
                                className="hidden h-6 w-5 flex-none text-gray-400 sm:block"
                              />
                              <div className="flex-auto">
                                <div className="flex items-start gap-x-3">
                                  <div className="text-sm/6 font-medium text-gray-900">{transaction.amount}</div>
                                  <div
                                    className={classNames(
                                      statuses[transaction.status],
                                      'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                                    )}
                                  >
                                    {transaction.status}
                                  </div>
                                </div>
                                {transaction.tax && (
                                  <div className="mt-1 text-xs/5 text-gray-500">{transaction.tax} tax</div>
                                )}
                              </div>
                            </div>
                            <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                            <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                          </td>
                          <td className="hidden py-5 pr-6 sm:table-cell">
                            <div className="text-sm/6 text-gray-900">{transaction.client}</div>
                            <div className="mt-1 text-xs/5 text-gray-500">{transaction.description}</div>
                          </td>
                          <td className="py-5 text-right">
                            <div className="flex justify-end">
                              <a
                                href={transaction.href}
                                className="text-sm/6 font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                View<span className="hidden sm:inline"> transaction</span>
                                <span className="sr-only">
                                    , invoice #{transaction.invoiceNumber}, {transaction.client}
                                  </span>
                              </a>
                            </div>
                            <div className="mt-1 text-xs/5 text-gray-500">
                              Invoice <span className="text-gray-900">#{transaction.invoiceNumber}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
