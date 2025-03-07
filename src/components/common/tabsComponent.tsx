import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface Tab {
  name: string;
  value: string;
  current: boolean;
}

interface TabsComponentProps {
  tabs: Tab[];
  onTabChange?: (orderStatus: string) => void;
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const TabsComponent: React.FC<TabsComponentProps> = (
  {
    tabs,
    onTabChange = () => {
    },
  },
) => {
  // Set the initial selected tab to the one marked as current or fallback to the first tab.
  const [selectedTab, setSelectedTab] = useState<Tab>(
    tabs.find((tab) => tab.current) || tabs[0],
  );

  // Handler for when the tab is changed from the dropdown (mobile view)
  const handleTabChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    const tabValue = event.target.value;
    const newTab = tabs.find((tab) => tab.value === tabValue);
    if (newTab) {
      setSelectedTab(newTab);
      onTabChange(newTab.value);
    }
  };

  // Handler for when a tab is clicked (desktop view)
  const handleTabClick = (
    e: React.MouseEvent<HTMLDivElement>,
    tab: Tab,
  ): void => {
    e.preventDefault();
    setSelectedTab(tab);
    onTabChange(tab.value);
  };

  return (
    <div>
      {/* Mobile version: select dropdown */}
      <div className="grid grid-cols-1 sm:hidden">
        <select
          value={selectedTab.value}
          onChange={handleTabChange}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        >
          {tabs.map((tab) => (
            <option key={tab.value} value={tab.value}>
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

      {/* Desktop version: navigation tabs */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex">
            {tabs.map((tab) => (
              <div
                key={tab.value}
                onClick={(e) => handleTabClick(e, tab)}
                className={classNames(
                  selectedTab.value === tab.value
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium select-none',
                )}
              >
                {tab.name}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TabsComponent;
