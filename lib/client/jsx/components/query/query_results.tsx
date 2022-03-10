import React, {useContext, useEffect, useMemo, useState} from 'react';
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
import {EditorSelection, EditorState} from '@codemirror/state';
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

// https://reactjs.org/docs/error-boundaries.html
// For #768, because just resetting the selection doesn't
//    happen early enough in the CodeMirror lifecycle...?
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error(error);
  }
  render() {
    // We'll still show the Component
    return this.props.children;
  }
}

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
      EditorView.lineWrapping
    ],
    []
  );

  const [selection, setSelection] = useState(
    EditorSelection.create([EditorSelection.range(0, 0)])
  );

  useEffect(() => {
    setSelection(EditorSelection.create([EditorSelection.range(0, 0)]));
  }, [codeMirrorText]);

  if (!rootModel) return null;

  return (
    <Grid container className={classes.resultsPane}>
      <Grid item className={classes.result}>
        <ErrorBoundary>
          <CodeMirror
            extensions={extensions}
            value={codeMirrorText}
            selection={selection}
            onUpdate={(v) => {
              if (v.docChanged && v.selectionSet) {
                setSelection(v.state.selection);
              }
            }}
          />
        </ErrorBoundary>
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
