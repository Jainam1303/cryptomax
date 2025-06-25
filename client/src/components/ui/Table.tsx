import React from 'react';
import clsx from 'clsx';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  hoverable?: boolean;
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  className,
  onRowClick,
  hoverable = false
}: TableProps<T>) {
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    
    return item[column.accessor] as React.ReactNode;
  };
  
  return (
    <div className="overflow-x-auto">
      <table className={clsx('min-w-full divide-y divide-gray-200 dark:divide-gray-700', className)}>
        <thead className="bg-gray-50 dark:bg-dark-300">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={clsx(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={clsx(
                  onRowClick && hoverable && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-300'
                )}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={clsx(
                      'px-6 py-4 text-sm text-gray-900 dark:text-white',
                      column.className
                    )}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;