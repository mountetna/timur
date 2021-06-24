import React, {
  useMemo,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import {makeStyles} from '@material-ui/core/styles';

import {Controlled as CodeMirror} from 'react-codemirror2';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
import {getAnswer} from 'etna-js/api/magma_api';
import {selectModels} from 'etna-js/selectors/magma';
import {Exchange} from 'etna-js/actions/exchange_actions';
import {downloadTSV, MatrixDatum} from 'etna-js/utils/tsv';
import {ReactReduxContext} from 'react-redux';

import {QueryContext} from '../../contexts/query/query_context';
import {QueryBuilder} from '../../utils/query_builder';
import {QueryResponse} from '../../contexts/query/query_types';
import QueryTable from './query_table';
import AntSwitch from './ant_switch';
import useTableEffects from './query_use_table_effects';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: '5px'
  },
  result: {
    padding: 10,
    margin: 10,
    border: '1px solid #0f0',
    borderRadius: 2,
    backgroundColor: 'rgba(0,255,0,0.1)'
  },
  config: {
    padding: 5,
    paddingTop: 0
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
  const {state} = useContext(QueryContext);
  let {store} = useContext(ReactReduxContext);
  const invoke = useActionInvoker();
  let reduxState = useReduxState();

  const builder = useMemo(() => {
    if (state.rootIdentifier && state.graph && state.graph.initialized) {
      let builder = new QueryBuilder(state.graph, selectModels(reduxState));

      builder.addRootIdentifier(state.rootIdentifier);
      builder.addAttributes(state.attributes);
      builder.addRecordFilters(state.recordFilters);
      builder.addSlices(state.slices);
      builder.setFlatten(flattenQuery);
      builder.setOrRecordFilterIndices(state.orRecordFilterIndices);

      return builder;
    }

    return null;
  }, [
    state.rootIdentifier,
    state.attributes,
    state.recordFilters,
    state.slices,
    state.graph,
    state.orRecordFilterIndices,
    flattenQuery,
    reduxState
  ]);

  const query = useMemo(() => {
    if (!builder) return '';

    return builder.query();
  }, [builder, flattenQuery]);

  const count = useMemo(() => {
    if (!builder) return '';

    return builder.count();
  }, [builder]);

  const runQuery = useCallback(() => {
    if ('' === count || '' === query) return;

    let exchange = new Exchange(store.dispatch, 'query-post-magma');
    getAnswer({query: count}, exchange)
      .then((countData) => {
        setNumRecords(countData.answer);
        return getAnswer(
          {query, page_size: pageSize, page: page + 1},
          exchange
        );
      })
      .then((answerData) => {
        setData(answerData);
        // setQueries([...queries].splice(0, 0, builder));
      })
      .catch((e) => {
        e.then((error: {[key: string]: string[]}) => {
          console.error(error);
          invoke(showMessages(error.errors || [error.error] || error));
        });
      });
  }, [query, count, builder, store.dispatch, pageSize, page]);

  useEffect(() => {
    // At some point, we can probably cache data and only
    //   fetch when needed?
    if (lastPage !== page || lastPageSize !== pageSize) {
      runQuery();
      setLastPage(page);
      setLastPageSize(pageSize);
    }
  }, [page, pageSize, lastPage, lastPageSize]);

  if (!state.rootModel || !state.rootIdentifier) return null;

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

  const {columns, rows, formatRowData} = useTableEffects(data, expandMatrices);

  const downloadData = useCallback(() => {
    if ('' === query) return;

    let exchange = new Exchange(store.dispatch, 'query-download-tsv-magma');
    getAnswer({query}, exchange)
      .then((allData) => {
        let rowData = formatRowData(allData, columns);
        let matrixMap = rowData.map((row: any) => {
          return columns.reduce(
            (acc: MatrixDatum, {label}, i: number) => {
              return {...acc, [label]: row[i]};
            },
            {rowNames: row[0]}
          );
        }, []);

        downloadTSV(
          matrixMap,
          ['rowNames'].concat(columns.map(({label}) => label)),
          'your-query'
        );
      })
      .catch((e) => {
        e.then((error: {[key: string]: string[]}) => {
          console.error(error);
          invoke(showMessages(error.errors || [error.error] || error));
        });
      });
  }, [query, store.dispatch, columns]);

  const classes = useStyles();

  return (
    <Grid container xs={12}>
      <Grid item xs={12} className={classes.result}>
        <CodeMirror
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
      </Grid>
      <Grid xs={12} item container direction='column'>
        <Grid
          className={classes.config}
          item
          container
          alignItems='center'
          justify='flex-end'
        >
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
          <Button className={classes.button} onClick={runQuery}>
            Query
          </Button>
          <Button className={classes.button} onClick={downloadData}>
            {'\u21af TSV'}
          </Button>
        </Grid>
        <Grid item>
          <QueryTable
            columns={columns}
            rows={rows}
            pageSize={pageSize}
            numRecords={numRecords}
            page={page}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QueryResults;
