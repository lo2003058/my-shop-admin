import React from 'react';
import Image from 'next/image';
import Tooltip from '@/components/common/tooltip';
import { Button } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash, faTrashArrowUp } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

/**
 * Represents the allowed types for each column/field.
 */
export type ColumnType =
  | 'text'
  | 'number'
  | 'image'
  | 'boolean'
  | 'select'
  | 'date'
  | 'object';

/**
 * Interface for select option mapping
 */
export interface SelectOption {
  key: number;
  value: string;
  color?: {
    background: string;
    text: string;
  };
}

/**
 * The definition of a single column/field in the table.
 * For the new types:
 * - When type is "date", provide a `format` string (e.g. "DD-MM-YYYY" or "DD-MM-YYYY HH:mm:ss").
 * - When type is "object", provide a `label` to specify which property in the object to display.
 */
export interface Field<T> {
  name: string;
  key: keyof T;
  type: ColumnType;
  format?: string; // For date type
  label?: string; // For object type
  option?: SelectOption[]; // Optional map for select type
  defaultColors?: {
    background: string;
    text: string;
  };
}

/**
 * Props for the DataTable component.
 */
interface DataTableProps<T> {
  data: T[];
  fields: Field<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onRestore?: (row: T) => void;
  onSearchChange?: (searchValue: string) => void;
  actionType?: ActionType[];
  isShowSearchBar?: boolean;
}

export type ActionType = 'edit' | 'delete' | 'view' | 'restore';

/**
 * Utility function to combine CSS classes.
 */
function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * A helper for rendering cell value based on field type.
 */
function renderCellValue<T>(field: Field<T>, value: T[keyof T]) {
  switch (field.type) {
    case 'image':
      return (
        <Image
          src={value ? String(value) : '/images/no-image-available.webp'}
          alt="image"
          className="h-10 w-10 object-cover rounded-full"
          width={40}
          height={40}
          priority
        />
      );
    case 'boolean':
      return value ? (
        <span
          className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
          True
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
          False
        </span>
      );
    case 'select':
      if (field.option) {
        const selectedOption = field.option.find(option => option.key === value);
        if (selectedOption) {
          const colors = selectedOption.color || field.defaultColors || {
            background: 'bg-gray-100',
            text: 'text-gray-700',
          };

          return (
            <span
              className={`${colors.background} ${colors.text} select-none inline-flex items-center rounded-full px-2 py-1 text-xs font-medium`}
            >
              {selectedOption.value}
            </span>
          );
        }
        return String(value);
      }
      return String(value);
    case 'date': {
      // Use moment to format the date.
      // If no value is provided, display a dash.
      const dateFormat = field.format || 'DD-MM-YYYY';
      return <span>{value ? moment(value).format(dateFormat) : '-'}</span>;
    }
    case 'object': {
      // When the field type is object, extract the property indicated by `label`.
      if (value && typeof value === 'object') {
        if (field.label) {
          const record = value as Record<string, unknown>;
          const labelValue = record[field.label];
          return <span>{labelValue !== undefined ? String(labelValue) : '-'}</span>;
        }
        // Fallback: if no label provided, show the JSON string.
        return <span>{JSON.stringify(value)}</span>;
      }
      return <span>{value ? String(value) : '-'}</span>;
    }
    default:
      return <span>{value ? String(value) : '-'}</span>;
  }
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
    onRestore,
    onSearchChange,
    actionType = [],
    isShowSearchBar = true,
  }: DataTableProps<T>,
) {
  const hasActions = actionType.length > 0;

  return (
    <div className="py-6">
      {/* Search bar (full width) */}
      {isShowSearchBar && (
        <input
          type="text"
          placeholder="Search..."
          className="block w-full rounded-t-xl border-t border-l border-r border-gray-300 bg-white px-3 py-2 text-md placeholder-gray-600 focus:outline-none text-gray-800"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      )}

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

                // Dynamic classes for the first <th>
                const firstThClasses = isFirst
                  ? classNames(
                    'border-l border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter',
                    !isShowSearchBar && !hasActions && 'rounded-l-xl border-t',
                    !isShowSearchBar && hasActions && 'rounded-l-xl border-t',
                    isShowSearchBar && !hasActions && 'rounded-bl-xl',
                    isShowSearchBar && hasActions && 'rounded-bl-xl',
                  )
                  : '';

                // Dynamic classes for the last <th>
                const lastThClasses = isLast
                  ? classNames(
                    'border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter',
                    !isShowSearchBar && !hasActions && 'border-r rounded-r-xl border-t',
                    !isShowSearchBar && hasActions && 'border-t',
                    isShowSearchBar && !hasActions && 'border-r rounded-br-xl',
                    isShowSearchBar && hasActions && '',
                  )
                  : '';

                return (
                  <th
                    key={String(field.key)}
                    scope="col"
                    className={classNames(
                      'sticky top-0 z-60 border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter',
                      isFirst ? firstThClasses : isLast ? lastThClasses : '',
                      // Add border-t to intermediate <th> if search bar is hidden
                      !isShowSearchBar && !isFirst && !isLast && 'border-t',
                    )}
                  >
                    {field.name}
                  </th>
                );
              })}

              {/* Actions Column */}
              {hasActions && (
                <th
                  scope="col"
                  className={classNames(
                    'sticky top-0 z-10 border-b border-r border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter',
                    !isShowSearchBar && 'border-t rounded-r-xl',
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
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => {
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
                          {renderCellValue(field, cellValue)}
                        </td>
                      );
                    })}

                    {/* Render action buttons if needed */}
                    {hasActions && (
                      <td
                        className={classNames(
                          !isLastRow && 'border-b border-gray-200',
                          'relative whitespace-nowrap px-3 py-4 text-left text-sm font-medium',
                        )}
                      >
                        {actionType.includes('view') && (
                          <Tooltip text="View" position="bottom">
                            <div
                              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                              onClick={() => onView?.(row)}
                            >
                              <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                                <FontAwesomeIcon icon={faEye} />
                              </Button>
                            </div>
                          </Tooltip>
                        )}
                        {actionType.includes('edit') && (
                          <Tooltip text="Edit" position="bottom">
                            <div
                              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                              onClick={() => onEdit?.(row)}
                            >
                              <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                                <FontAwesomeIcon icon={faPen} />
                              </Button>
                            </div>
                          </Tooltip>
                        )}
                        {actionType.includes('delete') && (
                          <Tooltip text="Delete" position="bottom">
                            <div
                              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                              onClick={() => onDelete?.(row)}
                            >
                              <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          </Tooltip>
                        )}
                        {actionType.includes('restore') && (
                          <Tooltip text="Restore" position="bottom">
                            <div
                              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                              onClick={() => onRestore?.(row)}
                            >
                              <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTrashArrowUp} />
                              </Button>
                            </div>
                          </Tooltip>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={fields.length + (hasActions ? 1 : 0)}
                  className="px-3 py-4 text-center text-sm text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
