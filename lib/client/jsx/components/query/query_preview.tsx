import React, {useMemo, useContext} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import {Controlled as CodeMirror} from 'react-codemirror2';

import {QueryContext} from '../../contexts/query/query_context';
import {QueryColumn} from '../../contexts/query/query_types';
import {QueryBuilder} from '../../utils/query_builder';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

const QueryPreview = () => {
  const {state} = useContext(QueryContext);
  const classes = useStyles();

  let columns = Object.values(state.attributes || {})
    .flat()
    .map((attr: QueryColumn) => attr.display_label);

  if (state.rootIdentifier) columns.unshift(state.rootIdentifier.display_label);

  const query = useMemo(() => {
    if (state.rootIdentifier && state.graph && state.graph.initialized) {
      let builder = new QueryBuilder(state.graph);

      builder.addRootIdentifier(state.rootIdentifier);
      builder.addAttributes(state.attributes);
      builder.addRecordFilters(state.recordFilters);
      builder.addSlices(state.slices);

      return builder.query();
    }

    return '';
  }, [
    state.rootIdentifier,
    state.attributes,
    state.recordFilters,
    state.slices,
    state.graph
  ]);

  if (!state.rootModel || !state.rootIdentifier) return null;

  return (
    <Card>
      <CardHeader title='Data Frame -- Preview' />
      <CardContent>
        <CodeMirror
          options={{
            readOnly: 'no-cursor',
            lineWrapping: true,
            mode: 'application/json',
            autoCloseBrackets: true,
            gutters: ['CodeMirror-lint-markers'],
            lint: false,
            tabSize: 2
          }}
          value={JSON.stringify(query)}
          onBeforeChange={(editor, data, value) => {}}
        />
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
      </CardContent>
    </Card>
  );
};

export default QueryPreview;
