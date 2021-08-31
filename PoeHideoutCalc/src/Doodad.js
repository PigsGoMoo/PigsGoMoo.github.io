import React from 'react';
import { useTable, useSortBy } from 'react-table';

function Doodad({ doodadArr }) {
  // Name - Seller - Level - Cost - Amt Have - Amt Need - Amt Remain - Remaining Cost - Total Cost
  const data = React.useMemo(() => [...doodadArr], []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Doodad Name',
        accessor: 'doodadName', // accessor is the "key" in the data
      },
      {
        Header: 'Seller',
        accessor: 'decorSeller',
      },
      {
        Header: 'Req Level',
        accessor: 'decorSellerLv',
      },
      {
        Header: 'Cost',
        accessor: 'decorCost',
      },
      {
        Header: 'Have',
        accessor: 'doodadCount',
      },
      {
        Header: 'Need',
        accessor: 'doodadReq',
      },
      {
        Header: 'Remaining',
        accessor: 'doodadRemain',
      },
      {
        Header: 'Remaining Cost',
        accessor: 'costRemain',
      },
      {
        Header: 'Total Cost',
        accessor: 'costTotal',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr
              className={row.values.doodadRemain === 0 ? 'green' : ''}
              {...row.getRowProps()}
            >
              {row.cells.map((cell) => {
                return (
                  <td
                    className={Number.isInteger(cell.value) ? 'right-text' : ''}
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Doodad;
