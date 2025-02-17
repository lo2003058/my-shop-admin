'use client';

import React from 'react';
import { Listbox } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

// The second generic K defaults to keyof T so you don't have to pass it explicitly.
export interface SelectMenuProps<T extends object, K extends keyof T = keyof T> {
  /** Array of items to choose from */
  items: T[];
  /** Property key for the primary text (e.g., "name") */
  labelName: keyof T;
  /** Property key for the unique value (e.g., "id") */
  labelValue: K;
  /** (Optional) Property key for secondary text (e.g., "username" or "requiredPoints") */
  secondaryLabel?: keyof T;
  /** (Optional) Label to display above the select input */
  label?: string;
  /**
   * The currently selected value (for example, an id).
   * When no item is selected, pass null.
   */
  value: T[K] | null;
  /**
   * Change handler that receives the new selected value (e.g., the id).
   */
  onChange: (value: T[K]) => void;
  /** Placeholder text when no value is selected */
  placeholder?: string;
}

function SelectMenu<T extends object, K extends keyof T = keyof T>({
                                                                     items,
                                                                     labelName,
                                                                     labelValue,
                                                                     secondaryLabel,
                                                                     label,
                                                                     value,
                                                                     onChange,
                                                                     placeholder = 'Select an option',
                                                                   }: SelectMenuProps<T, K>) {
  // Find the currently selected item by matching the provided value using the labelValue key.
  const selectedItem = items.find(item => item[labelValue] === value) ?? null;

  // When an option is selected, pass its labelValue to the onChange callback.
  const handleChange = (item: T) => {
    onChange(item[labelValue]);
  };

  return (
    <Listbox value={selectedItem} onChange={handleChange}>
      {label && (
        <Listbox.Label className="block text-sm font-medium text-gray-900">
          {label}
        </Listbox.Label>
      )}
      <div className="relative mt-2">
        <Listbox.Button
          className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900
                     outline outline-1 outline-gray-300 focus:outline focus:outline-2 focus:outline-indigo-600"
        >
          <span className="col-start-1 row-start-1 flex w-full gap-2 pr-6">
            {selectedItem ? (
              <>
                <span className="truncate">{String(selectedItem[labelName])}</span>
                {secondaryLabel && (
                  <span className="truncate text-gray-500">
                    {String(selectedItem[secondaryLabel])}
                  </span>
                )}
              </>
            ) : (
              <span className="truncate text-gray-500">{placeholder}</span>
            )}
          </span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="col-start-1 row-start-1 self-center justify-self-end text-gray-500"
          />
        </Listbox.Button>

        <Listbox.Options
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg
                     ring-1 ring-black/5 focus:outline-none"
        >
          {items.map((item) => (
            <Listbox.Option
              key={String(item[labelValue])}
              value={item}
              className={({ active }) =>
                `group relative cursor-default select-none py-2 pl-3 pr-9 ${
                  active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                }`
              }
            >
              {({ selected, active }) => (
                <>
                  <div className="flex flex-col">
                    <span className={`${selected ? 'font-semibold' : 'font-normal'} whitespace-normal`}>
                      {String(item[labelName])}
                    </span>
                    {secondaryLabel && (
                      <span className={`ml-2 whitespace-normal ${active ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {String(item[secondaryLabel])}
                      </span>
                    )}
                  </div>
                  {selected && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                      <FontAwesomeIcon icon={faCheck} className="w-5 h-5" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

export default SelectMenu;
