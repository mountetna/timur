import React, {
  useMemo,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import {Controlled as CodeMirror} from 'react-codemirror2';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
import {getAnswer} from 'etna-js/api/magma_api';
import {selectModels} from 'etna-js/selectors/magma';
import {Exchange} from 'etna-js/actions/exchange_actions';
import {ReactReduxContext} from 'react-redux';

import {QueryContext} from '../../contexts/query/query_context';
import {QueryBuilder} from '../../utils/query_builder';
import {QueryResponse} from '../../contexts/query/query_types';
import QueryTable from './query_table';
import AntSwitch from './ant_switch';

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
        // setQueries([...queries].splice(0, 0, query as string[]));
      })
      .catch((e) => {
        e.then((error: {[key: string]: string[]}) => {
          console.error(error);
          invoke(showMessages(error.errors));
        });
      });
  }, [query, count, queries, store.dispatch, pageSize, page]);

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

  return (
    <Card>
      <CardHeader title='Data Frame' />
      <CardContent>
        <Grid container direction='column'>
          <Grid item>
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
          </Grid>
          <Grid
            item
            container
            spacing={1}
            alignItems='center'
            justify='space-around'
          >
            <Grid item xs={4}>
              <Typography component='div'>
                <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
                >
                  <Grid item>Nest matrices</Grid>
                  <Grid item>
                    <AntSwitch
                      checked={expandMatrices}
                      onChange={() => setExpandMatrices(!expandMatrices)}
                      name='expand-matrices-query'
                    />
                  </Grid>
                  <Grid item>Expand matrices</Grid>
                </Grid>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography component='div'>
                <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
                >
                  <Grid item>Expanded</Grid>
                  <Grid item>
                    <AntSwitch
                      checked={flattenQuery}
                      onChange={() => setFlattenQuery(!flattenQuery)}
                      name='flatten-query'
                    />
                  </Grid>
                  <Grid item>Flattened</Grid>
                </Grid>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <ButtonGroup
                variant='contained'
                color='primary'
                aria-label='contained primary button group'
              >
                <Button disabled>Previous Queries</Button>
                <Button onClick={runQuery}>Query</Button>
                <Button disabled>{'\u21af TSV'}</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <Grid item>
            <QueryTable
              data={data}
              expandMatrices={expandMatrices}
              pageSize={pageSize}
              numRecords={numRecords}
              page={page}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QueryResults;
