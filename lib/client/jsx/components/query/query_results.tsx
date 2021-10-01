import React, {
  useMemo,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ReplayIcon from '@material-ui/icons/Replay';
import ShareIcon from '@material-ui/icons/Share';

import {makeStyles} from '@material-ui/core/styles';

import {Controlled as CodeMirror} from 'react-codemirror2';

import {copyText} from 'etna-js/utils/copy';
import {QueryGraphContext} from '../../contexts/query/query_graph_context';
import {
  QueryColumnContext,
  defaultQueryColumnParams
} from '../../contexts/query/query_column_context';
import {
  QueryWhereContext,
  defaultQueryWhereParams
} from '../../contexts/query/query_where_context';
import {QueryBuilder} from '../../utils/query_builder';
import {QueryResponse} from '../../contexts/query/query_types';
import QueryTable from './query_table';
import useTableEffects from './query_use_table_effects';
import useResultsActions from './query_use_results_actions';
import AntSwitch from './ant_switch';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: '5px'
  },
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
  const [expandMatrices, setExpandMatrices] = useState(true);
  const [flattenQuery, setFlattenQuery] = useState(true);
  const [lastPage, setLastPage] = useState(0);
  const [page, setPage] = useState(0);
  const [lastPageSize, setLastPageSize] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [queries, setQueries] = useState([] as string[][]);
  const [data, setData] = useState({} as QueryResponse);
  const [numRecords, setNumRecords] = useState(0);
  const {
    state: {graph, rootModel},
    setRootModel
  } = useContext(QueryGraphContext);
  const {
    state: {columns},
    setQueryColumns
  } = useContext(QueryColumnContext);
  const {
    state: {recordFilters, orRecordFilterIndices},
    setWhereState
  } = useContext(QueryWhereContext);
  // let {store} = useContext(ReactReduxContext);
  // const invoke = useActionInvoker();
  const classes = useStyles();

  const builder = useMemo(() => {
    if (rootModel && graph && graph.initialized) {
      let builder = new QueryBuilder(graph);

      builder.addRootModel(rootModel);
      builder.addColumns(columns);
      builder.addRecordFilters(recordFilters);
      builder.setFlatten(flattenQuery);
      builder.setOrRecordFilterIndices(orRecordFilterIndices);

      return builder;
    }

    return null;
  }, [
    columns,
    recordFilters,
    graph,
    orRecordFilterIndices,
    flattenQuery,
    rootModel
  ]);

  const query = useMemo(() => {
    if (!builder) return '';

    return builder.query();
  }, [builder]);

  const count = useMemo(() => {
    if (!builder) return '';

    return builder.count();
  }, [builder]);

  const {
    columns: formattedColumns,
    rows,
    formatRowData
  } = useTableEffects({columns, data, graph, expandMatrices});

  const {runQuery, downloadData} = useResultsActions({
    countQuery: count,
    query,
    page,
    pageSize,
    rootModel,
    formattedColumns,
    setData,
    setNumRecords,
    formatRowData
  });

  useEffect(() => {
    // At some point, we can probably cache data and only
    //   fetch when needed?
    if (lastPage !== page || lastPageSize !== pageSize) {
      runQuery();
      setLastPage(page);
      setLastPageSize(pageSize);
    }
  }, [page, pageSize, lastPage, lastPageSize, runQuery]);

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

  function resetQuery() {
    setRootModel(null);
    setQueryColumns(defaultQueryColumnParams.columns);
    setWhereState(defaultQueryWhereParams);
  }

  function copyLink() {
    copyText(window.location.href);
  }

  if (!rootModel) return null;

  return (
    <Grid container className={classes.resultsPane}>
      <CodeMirror
        className={classes.result}
        options={{
          readOnly: 'no-cursor',
          lineWrapping: true,
          mode: 'application/json',
          autoCloseBrackets: true,
          lint: false,
          background: 'none',
          tabSize: 2
        }}
        value={JSON.stringify(query)}
        onBeforeChange={(editor, data, value) => {}}
      />
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
          <Button className={classes.button} disabled>
            Previous Queries
          </Button>
          <Button
            className={classes.button}
            color='default'
            onClick={resetQuery}
            startIcon={<ReplayIcon />}
          >
            Reset Query
          </Button>
          <Button
            className={classes.button}
            color='secondary'
            onClick={runQuery}
          >
            Query
          </Button>
          <Button className={classes.button} onClick={downloadData}>
            {'\u21af TSV'}
          </Button>
          <Button
            className={classes.button}
            onClick={copyLink}
            startIcon={<ShareIcon />}
          >
            Copy Link
          </Button>
        </Grid>
        <QueryTable
          maxColumns={10}
          columns={formattedColumns}
          rows={rows}
          pageSize={pageSize}
          numRecords={numRecords}
          page={page}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
        />
      </Grid>
    </Grid>
  );
};

export default QueryResults;
