import React, {useCallback, useContext, useMemo, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

import {QueryGraphContext} from '../../contexts/query/query_graph_context';
import {QueryColumnContext} from '../../contexts/query/query_column_context';
import {QueryResultsContext} from '../../contexts/query/query_results_context';
import {userColumns} from '../../selectors/query_selector';
import QueryTable from './query_table';
import useTableEffects from './query_use_table_effects';
import AntSwitch from './ant_switch';

import {defaultHighlightStyle} from '@codemirror/highlight';
import {json} from '@codemirror/lang-json';
import {EditorView} from '@codemirror/view';
import {EditorState} from '@codemirror/state';
import CodeMirror from 'rodemirror';

const useStyles = makeStyles((theme) => ({
  checkbox: {
    marginRight: '30px'
  },
  result: {
    width: '100%',
    padding: 10,
    margin: 10,
    border: '1px solid #0f0',
    borderRadius: 2,
    backgroundColor: 'rgba(0,255,0,0.1)'
  },
  config: {
    padding: 5,
    paddingTop: 0,
    alignSelf: 'flex-end'
  },
  resultsPane: {
    overflowX: 'auto',
    maxWidth: '100%',
    maxHeight: '100%'
  }
}));

const QueryResults = () => {
  const {
    state: {graph, rootModel}
  } = useContext(QueryGraphContext);
  const {
    state: {columns}
  } = useContext(QueryColumnContext);
  const {
    state: {
      pageSize,
      page,
      numRecords,
      queryString,
      data,
      expandMatrices,
      flattenQuery,
      maxColumns
    },
    setPageSize,
    setPage,
    setExpandMatrices,
    setFlattenQuery
  } = useContext(QueryResultsContext);

  const classes = useStyles();

  const {columns: formattedColumns, rows} = useTableEffects({
    columns,
    data,
    graph,
    expandMatrices,
    maxColumns
  });

  function handlePageSizeChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setPageSize(parseInt(e.target.value));
  }

  function handlePageChange(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) {
    setPage(newPage);
  }

  const userColumnsStr = useMemo(() => {
    return JSON.stringify(userColumns(columns));
  }, [columns]);

  const codeMirrorText = `query: ${queryString}\nuser_columns: ${userColumnsStr}`;

  const extensions = useMemo(
    () => [
      defaultHighlightStyle.fallback,
      json(),
      EditorView.editable.of(false),
      EditorState.readOnly.of(true),
      // EditorState.transactionFilter.of((tr) => {
      //   console.log('tr', tr, tr.docChanged, tr.selection);
      //   if (!tr.docChanged && tr.selection) {
      //     console.log('1');
      //     // Pass through as normal. Selection-only change
      //     return {...tr};
      //   } else {
      //     console.log('2');
      //     // If this is only a doc change, clear the selection.
      //     return {
      //       ...tr,
      //       selection: {
      //         anchor: 0,
      //         head: 0
      //       }
      //     };
      //   }
      // }),
      EditorView.lineWrapping
    ],
    []
  );

  const [selection, setSelection] = useState({anchor: 0, head: 0});
  const handleOnUpdate = useCallback((v: any) => {
    console.log('v', v);
  }, []);

  if (!rootModel) return null;

  console.log('codeMirrorText', codeMirrorText);
  return (
    <Grid container className={classes.resultsPane}>
      <Grid item className={classes.result}>
        <CodeMirror
          extensions={extensions}
          value={codeMirrorText}
          selection={selection}
          onUpdate={handleOnUpdate}
        />
      </Grid>
      <Grid xs={12} item container direction='column'>
        <Grid className={classes.config} item container justify='flex-end'>
          <AntSwitch
            checked={expandMatrices}
            onChange={() => setExpandMatrices(!expandMatrices)}
            name='expand-matrices-query'
            leftOption='Nest matrices'
            rightOption='Expand matrices'
          />
          <AntSwitch
            checked={flattenQuery}
            onChange={() => setFlattenQuery(!flattenQuery)}
            name='flatten-query'
            leftOption='Nested'
            rightOption='Flattened'
          />
        </Grid>
        <QueryTable
          maxColumns={maxColumns}
          columns={formattedColumns}
          rows={rows}
          pageSize={pageSize}
          numRecords={numRecords}
          page={page}
          graph={graph}
          expandMatrices={expandMatrices}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
        />
      </Grid>
    </Grid>
  );
};

export default QueryResults;
