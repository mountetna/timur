import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';

import {QueryTableColumn} from '../../contexts/query/query_types';
import AttributeViewer from '../attributes/attribute_viewer';
import {QueryGraph} from '../../utils/query_graph';
import {Attribute} from 'etna-js/models/magma-model';

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
  maxColumns,
  graph,
  expandMatrices,
  handlePageChange,
  handlePageSizeChange
}: {
  columns: QueryTableColumn[];
  rows: any;
  numRecords: number;
  page: number;
  pageSize: number;
  maxColumns: number;
  graph: QueryGraph;
  expandMatrices: boolean;
  handlePageChange: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => void;
  handlePageSizeChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}) => {
  const classes = useStyles();

  function filename(path: string | null) {
    return path == null
      ? null
      : new URL(`https://${path}`).pathname.split('/').pop();
  }

  function mockRecord(attribute: Attribute | null, value: any) {
    if (!attribute) return {};

    switch (attribute.attribute_type) {
      case 'file':
      case 'image':
        let name = filename(value);

        return {
          [attribute.attribute_name]: name
            ? {
                url: value,
                original_filename: name,
                path: name
              }
            : null
        };
      case 'file_collection':
        return {
          [attribute.attribute_name]: value?.map((datum: string) => {
            return {
              url: datum,
              original_filename: filename(datum),
              path: filename(datum)
            };
          })
        };
      default:
        return {
          [attribute.attribute_name]: value
        };
    }
  }

  return (
    <React.Fragment>
      <Grid
        container
        justify='flex-end'
        direction='column'
        alignItems='flex-end'
      >
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
                      {expandMatrices &&
                      columns[index].attribute?.attribute_type == 'matrix' ? (
                        datum?.toString()
                      ) : (
                        <AttributeViewer
                          attribute_name={
                            columns[index].attribute?.attribute_name
                          }
                          record={mockRecord(columns[index].attribute, datum)}
                          model_name={columns[index].modelName}
                          template={graph.template(columns[index].modelName)}
                        />
                      )}
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
