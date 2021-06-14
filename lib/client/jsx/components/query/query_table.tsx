import React, {useMemo, useContext} from 'react';
import * as _ from 'lodash';

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectModels} from 'etna-js/selectors/magma';
import {pathToColumn, attributeIsMatrix} from '../../selectors/query_selector';
import {QueryContext} from '../../contexts/query/query_context';
import {QueryColumn, QueryResponse} from '../../contexts/query/query_types';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

const QueryTable = ({
  data,
  expandMatrices,
  numRecords,
  page,
  pageSize,
  handlePageChange,
  handlePageSizeChange
}: {
  data: QueryResponse;
  expandMatrices: boolean;
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
  const {state} = useContext(QueryContext);
  const reduxState = useReduxState();
  const classes = useStyles();

  function generateIdCol(attr: QueryColumn): string {
    return `${CONFIG.project_name}::${attr.model_name}#${attr.attribute_name}`;
  }

  const columns = useMemo(() => {
    if (!state.rootIdentifier) return [];

    let colDefs: {
      label: string;
      colId: string;
    }[] = [
      {
        colId: generateIdCol(state.rootIdentifier),
        label: state.rootIdentifier.display_label
      }
    ];

    // return colDefs.concat(
    //   Object.values(state.attributes || {})
    //     .flat()
    //     .map((attr) => {
    //       return {
    //         label: attr.display_label,
    //         colId: generateIdCol(attr)
    //       };
    //     })
    // );
    return colDefs.concat(
      Object.values(state.attributes || {})
        .flat()
        .reduce((acc: {label: string; colId: string}[], attr) => {
          if (
            expandMatrices &&
            attributeIsMatrix(
              selectModels(reduxState),
              attr.model_name,
              attr.attribute_name
            )
          ) {
          } else {
            acc.push({
              label: attr.display_label,
              colId: generateIdCol(attr)
            });
          }

          return acc;
        }, [])
    );
  }, [state.attributes, state.rootIdentifier, reduxState]);

  const rows = useMemo(() => {
    if (!data || !data.answer) return;

    let colMapping = data.format[1];
    // Need to order the results the same as `columns`
    return data.answer.map(([recordName, answer]: [string, any[]]) =>
      columns.map(({colId}) =>
        _.at(answer, pathToColumn(colMapping, colId, expandMatrices)).flat()
      )
    );
  }, [data, columns]);

  if (0 === columns.length) return null;
  console.log('rows', rows, columns);
  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table className={classes.table} size='small' aria-label='result table'>
          <TableHead>
            <TableRow>
              {columns.map(({label}: {label: string}) => (
                <TableCell>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              ? rows.map((row: any[]) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row[0]}>
                      {row.map((datum: any, index: number) => (
                        <TableCell key={index} scope='row' padding='none'>
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
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 200]}
        component='div'
        count={numRecords}
        rowsPerPage={pageSize}
        page={page}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePageSizeChange}
      />
    </React.Fragment>
  );
};

export default QueryTable;
