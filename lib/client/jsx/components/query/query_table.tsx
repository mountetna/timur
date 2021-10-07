import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';

import {QueryTableColumn} from '../../contexts/query/query_types';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  columnWarning: {
    color: 'red',
    paddingRight: '0.6rem'
  }
});

const QueryTable = ({
  columns,
  rows,
  numRecords,
  page,
  pageSize,
  maxColumns,
  handlePageChange,
  handlePageSizeChange
}: {
  columns: QueryTableColumn[];
  rows: any;
  numRecords: number;
  page: number;
  pageSize: number;
  maxColumns: number;
  handlePageChange: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => void;
  handlePageSizeChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid
        container
        justify='flex-end'
        direction='column'
        alignItems='flex-end'
      >
        {columns.length > maxColumns ? (
          <Typography className={classes.columnWarning}>
            *** NOTE *** {(columns.length - maxColumns).toLocaleString()}{' '}
            columns not rendered. Add slices to your matrix columns or download
            the TSV to see the whole data frame.
          </Typography>
        ) : null}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 200]}
          component='div'
          count={numRecords}
          rowsPerPage={pageSize}
          page={page}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePageSizeChange}
        />
      </Grid>
      <TableContainer>
        <Table className={classes.table} size='small' aria-label='result table'>
          <TableHead>
            <TableRow>
              {columns
                ?.slice(0, maxColumns)
                .map(({label}: {label: string}, index: number) => (
                  <TableCell key={index}>{label}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row: any[]) => {
              return (
                <TableRow hover tabIndex={-1} key={row[0]}>
                  {row.slice(0, maxColumns).map((datum: any, index: number) => (
                    <TableCell key={index} scope='row'>
                      {datum?.toString()}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default QueryTable;
