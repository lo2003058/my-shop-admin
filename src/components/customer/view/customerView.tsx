import React, { useState } from 'react';
import { CustomerViewProps } from '@/types/customer/types';
import CustomerBasicInfo from '@/components/customer/view/customerBasicInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import CustomerOrders from '@/components/customer/view/customerOrders';
import CustomerTier from '@/components/customer/view/customerTier';
import CustomerPoints from '@/components/customer/view/customerPoints';
import CustomerAddress from '@/components/customer/view/customerAddress';

type Tab = {
  name: string;
  key: number;
  current: boolean;
};

const tabs: Tab[] = [
  { name: 'Basic information', key: 1, current: true },
  { name: 'Tier', key: 2, current: false },
  { name: 'Point', key: 3, current: false },
  { name: 'Address', key: 4, current: false },
  { name: 'Linked orders', key: 5, current: false },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const CustomerView: React.FC<CustomerViewProps> = ({ customerData = {} }) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const handleTabChange = (tabKey: number) => {
    setActiveTab(tabKey);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTab = parseInt(event.target.value, 10);
    handleTabChange(newTab);
  };

  // Render the appropriate content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <CustomerBasicInfo customerData={customerData} />;
      case 2:
        return <CustomerTier customerData={customerData} />;
      case 3:
        return <CustomerPoints customerData={customerData} />;
      case 4:
        return <CustomerAddress customerData={customerData} />;
      case 5:
        return <CustomerOrders customerData={customerData} />;
      default:
        return <>{`You can't come here, bro`}</>;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:hidden">
        <select
          value={activeTab}
          onChange={handleSelectChange}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        >
          {tabs.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.name}
            </option>
          ))}
        </select>
        <FontAwesomeIcon
          icon={faChevronDown}
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabChange(tab.key)}
                aria-current={activeTab === tab.key ? 'page' : undefined}
                className={classNames(
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium',
                )}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="min-h-[600px] w-auto p-4">
        {renderTabContent()}
      </div>
    </>
  );
};

export default CustomerView;
