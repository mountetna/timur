import React, {useMemo, useContext, useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import ReplayIcon from '@material-ui/icons/Replay';
import ShareIcon from '@material-ui/icons/Share';

import {makeStyles} from '@material-ui/core/styles';

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
import {
  QueryResultsContext,
  defaultQueryResultsParams
} from '../../contexts/query/query_results_context';
import {QueryBuilder} from '../../utils/query_builder';
import useTableEffects from './query_use_table_effects';
import useResultsActions from './query_use_results_actions';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: '5px'
  }
}));

const QueryControlButtons = () => {
  const [lastPage, setLastPage] = useState(defaultQueryResultsParams.page);
  const [lastPageSize, setLastPageSize] = useState(
    defaultQueryResultsParams.pageSize
  );
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
  const {
    state: {pageSize, page, data, expandMatrices, flattenQuery, queryString},
    setQueryString,
    setDataAndNumRecords,
    setResultsState
  } = useContext(QueryResultsContext);
  const classes = useStyles();
  const maxColumns = 10;

  useEffect(() => {
    setLastPage(page);
    setLastPageSize(pageSize);
  }, []);

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
  } = useTableEffects({columns, data, graph, expandMatrices, maxColumns});

  const {runQuery, downloadData} = useResultsActions({
    countQuery: count,
    query,
    page,
    pageSize,
    rootModel,
    formattedColumns,
    setDataAndNumRecords,
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

  useEffect(() => {
    if (JSON.stringify(query) !== queryString)
      setQueryString(JSON.stringify(query));
  }, [query, setQueryString, queryString]);

  function resetQuery() {
    setRootModel(null);
    setResultsState(defaultQueryResultsParams);
    setQueryColumns(defaultQueryColumnParams.columns);
    setWhereState(defaultQueryWhereParams);
  }

  function copyLink() {
    copyText(window.location.href);
  }

  if (!rootModel) return null;

  return (
    <React.Fragment>
      <Button
        className={classes.button}
        color='default'
        onClick={resetQuery}
        startIcon={<ReplayIcon />}
      >
        Reset Query
      </Button>
      <Button className={classes.button} color='secondary' onClick={runQuery}>
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
    </React.Fragment>
  );
};

export default QueryControlButtons;
