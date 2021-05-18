import React, {useState, useContext} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {QueryContext} from '../../contexts/query/query_context';
import {QueryColumn} from '../../contexts/query/query_types';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

const QueryPreview = () => {
  const {state} = useContext(QueryContext);
  const classes = useStyles();

  if (!state.rootModel || !state.rootIdentifier) return null;

  let columns = Object.values(state.attributes || {})
    .flat()
    .map((attr: QueryColumn) => attr.display_label);
  columns.unshift(state.rootIdentifier.display_label);

  return (
    <TableContainer component={Paper}>
      <Table
        className={classes.table}
        size='small'
        aria-label='result preview table'
      >
        <TableHead>
          <TableRow>
            {columns.map((heading: string) => (
              <TableCell>{heading}</TableCell>
            ))}
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );
};

export default QueryPreview;
