import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import {QueryTableColumn} from '../../contexts/query/query_types';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

const QueryTable = ({
  columns,
  rows,
  numRecords,
  page,
  pageSize,
  handlePageChange,
  handlePageSizeChange
}: {
  columns: QueryTableColumn[];
  rows: any;
  numRecords: number;
  page: number;
  pageSize: number;
  handlePageChange: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => void;
  handlePageSizeChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}) => {
  const classes = useStyles();

  if (0 === columns.length) return null;

  return (
    <React.Fragment>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 200]}
        component='div'
        count={numRecords}
        rowsPerPage={pageSize}
        page={page}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePageSizeChange}
      />
      <TableContainer>
        <Table className={classes.table} size='small' aria-label='result table'>
          <TableHead>
            <TableRow>
              {columns.map(({label}: {label: string}, index: number) => (
                <TableCell key={index}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              ? rows.map((row: any[]) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row[0]}>
                      {row.map((datum: any, index: number) => (
                        <TableCell key={index} scope='row'>
                          {datum}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default QueryTable;
