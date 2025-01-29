import React from 'react';
import Image from 'next/image';
import Tooltip from '@/components/common/tooltip';
import { Button } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

/**
 * Represents the allowed types for each column/field.
 */
export type ColumnType = 'text' | 'number' | 'image' | 'boolean';

export type ActionType = 'edit' | 'delete' | 'view';

/**
 * The definition of a single column/field in the table.
 * - `name` is the display name in the header.
 * - `key` is the key in your data object.
 * - `type` indicates how to render the field (text, number, image, boolean).
 */
export interface Field<T> {
  name: string;
  key: keyof T;
  type: ColumnType;
}

/**
 * Props for the DataTable component.
 * - `data`: an array of data objects.
 * - `fields`: column definitions mapping to the data's keys.
 * - `onEdit`: optional callback if you want to handle row editing.
 * - `onDelete`: optional callback if you want to handle row deletion.
 * - `onView`: optional callback if you want to handle row viewing.
 * - `onSearchChange`: callback for the search bar; returns typed value to the parent.
 */
interface DataTableProps<T> {
  data: T[];
  fields: Field<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onSearchChange?: (searchValue: string) => void;
  actionType?: ActionType[];
  isShowSearchBar?: boolean;
}

/**
 * Utility function to combine CSS classes.
 */
function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * A reusable DataTable component in TypeScript.
 */
export function DataTableComponent<T extends object>(
  {
    data,
    fields,
    onEdit,
    onDelete,
    onView,
    onSearchChange,
    actionType = [],
    isShowSearchBar = true,
  }: DataTableProps<T>,
) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">

      {/* Search bar (full width) */}
      {
        isShowSearchBar && (
          <input
            type="text"
            placeholder="Search..."
            className="block w-full rounded-t-xl border-t border-l border-r border-gray-300 bg-white px-3 py-2 text-mdplaceholder-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            onChange={(e) => {
              if (onSearchChange) {
                onSearchChange(e.target.value);
              }
            }}
          />
        )
      }

      {/* Table */}
      <div className="flow-root">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border-separate border-spacing-0">
            {/* Table Head */}
            <thead>
            <tr>
              {fields.map((field, index) => {
                const isFirst = index === 0;
                const isLast = index === fields.length - 1;
                const hasActions = actionType?.length > 0;

                // Determine classes for the first <th>
                const firstThClasses = isFirst
                  ? classNames(
                    'border-l border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter',
                    // Scenario 1: isShowSearchBar = false, no actions
                    !isShowSearchBar && !hasActions && 'rounded-l-xl border-t',
                    // Scenario 2: isShowSearchBar = false, with actions
                    !isShowSearchBar && hasActions && 'rounded-l-xl border-t',
                    // Scenario 3: isShowSearchBar = true, no actions
                    isShowSearchBar && !hasActions && 'rounded-bl-xl',
                    // Scenario 4: isShowSearchBar = true, with actions
                    isShowSearchBar && hasActions && 'rounded-bl-xl',
                  )
                  : '';

                // Determine classes for the last <th>
                const lastThClasses = isLast
                  ? classNames(
                    'border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter',
                    // Scenario 1: isShowSearchBar = false, no actions
                    !isShowSearchBar && !hasActions && 'border-r rounded-r-xl border-t',
                    // Scenario 2: isShowSearchBar = false, with actions
                    !isShowSearchBar && hasActions && 'border-t',
                    // Scenario 3: isShowSearchBar = true, no actions
                    isShowSearchBar && !hasActions && 'border-r rounded-br-xl',
                    // Scenario 4: isShowSearchBar = true, with actions
                    isShowSearchBar && hasActions && '',
                  )
                  : '';

                return (
                  <th
                    key={String(field.key)}
                    scope="col"
                    className={classNames(
                      'sticky top-0 z-10 border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter',
                      isFirst ? firstThClasses : isLast ? lastThClasses : '',
                      // Scenario 3: Add border-t to all <th> if isShowSearchBar is false
                      !isShowSearchBar && !isFirst && !isLast && 'border-t',
                    )}
                  >
                    {field.name}
                  </th>
                );
              })}

              {/* Actions Column */}
              {actionType?.length > 0 && (
                <th
                  scope="col"
                  className={classNames(
                    'sticky top-0 z-10 border-b border-r border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter',
                    // Scenario 1: isShowSearchBar = false
                    !isShowSearchBar && 'border-t rounded-r-xl',
                    // Scenario 4: isShowSearchBar = true
                    isShowSearchBar && 'rounded-br-xl',
                  )}
                >
                  Actions
                </th>
              )}
            </tr>

            </thead>

            {/* Table Body */}
            <tbody>
            {data.map((row, rowIndex) => {
              const isLastRow = rowIndex === data.length - 1;
              return (
                <tr key={rowIndex}>
                  {fields.map((field) => {
                    const cellValue = row[field.key];
                    return (
                      <td
                        key={String(field.key)}
                        className={classNames(
                          !isLastRow && 'border-b border-gray-200',
                          'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                        )}
                      >
                        {/* Render cell depending on the type */}
                        {field.type === 'image' && (
                          <Image
                            src={String(cellValue)}
                            alt={`${field.key as string}`}
                            className="h-10 w-10 object-cover rounded-full"
                            width={40}
                            height={40}
                          />
                        )}
                        {field.type === 'text' && (
                          <span>{String(cellValue)}</span>
                        )}
                        {field.type === 'number' && (
                          <span>{String(cellValue)}</span>
                        )}
                        {field.type === 'boolean' && (
                          cellValue ? (
                            <span
                              className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                  True
                                </span>
                          ) : (
                            <span
                              className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                  False
                                </span>
                          )
                        )}
                      </td>
                    );
                  })}
                  {
                    actionType?.length > 0 && (
                      <td
                        className={classNames(
                          !isLastRow && 'border-b border-gray-200',
                          'relative whitespace-nowrap px-3 py-4 text-left text-sm font-medium',
                        )}
                      >
                        {actionType.includes('view') && (
                          <Tooltip text="View" position={'bottom'}>
                            <div
                              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                              onClick={() => onView && onView(row)}
                            >
                              <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                                <FontAwesomeIcon icon={faEye} />
                              </Button>
                            </div>
                          </Tooltip>
                        )}
                        {actionType.includes('edit') && (
                          <Tooltip text="Edit" position={'bottom'}>
                            <div
                              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                              onClick={() => onEdit && onEdit(row)}
                            >
                              <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                                <FontAwesomeIcon icon={faPen} />
                              </Button>
                            </div>
                          </Tooltip>
                        )}
                        {actionType.includes('delete') && (
                          <Tooltip text="Delete" position={'bottom'}>
                            <div
                              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                              onClick={() => onDelete && onDelete(row)}
                            >
                              <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          </Tooltip>
                        )}
                      </td>
                    )
                  }
                </tr>
              );
            })}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
