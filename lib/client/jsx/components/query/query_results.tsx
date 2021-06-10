import React, {
  useMemo,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import {
  makeStyles,
  withStyles,
  Theme,
  createStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Switch, {SwitchClassKey, SwitchProps} from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import {Controlled as CodeMirror} from 'react-codemirror2';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
import {getAnswer} from 'etna-js/api/magma_api';
import {Exchange} from 'etna-js/actions/exchange_actions';
import {ReactReduxContext} from 'react-redux';

import {QueryContext} from '../../contexts/query/query_context';
import {QueryColumn} from '../../contexts/query/query_types';
import {QueryBuilder} from '../../utils/query_builder';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

const AntSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex'
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main
        }
      }
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none'
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white
    },
    checked: {}
  })
)(Switch);

const QueryResults = () => {
  const [flattenQuery, setFlattenQuery] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [queries, setQueries] = useState([] as string[][]);
  const [data, setData] = useState({} as any);
  const [numRecords, setNumRecords] = useState(0);
  const {state} = useContext(QueryContext);
  const classes = useStyles();
  let {store} = useContext(ReactReduxContext);
  const invoke = useActionInvoker();

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

    return colDefs.concat(
      Object.values(state.attributes || {})
        .flat()
        .map((attr) => {
          return {
            label: attr.display_label,
            colId: generateIdCol(attr)
          };
        })
    );
  }, [state.attributes, state.rootIdentifier]);

  const builder = useMemo(() => {
    if (state.rootIdentifier && state.graph && state.graph.initialized) {
      let builder = new QueryBuilder(state.graph);

      builder.addRootIdentifier(state.rootIdentifier);
      builder.addAttributes(state.attributes);
      builder.addRecordFilters(state.recordFilters);
      builder.addSlices(state.slices);

      return builder;
    }

    return null;
  }, [
    state.rootIdentifier,
    state.attributes,
    state.recordFilters,
    state.slices,
    state.graph
  ]);

  const query = useMemo(() => {
    if (!builder) return '';

    return builder.query(flattenQuery);
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
        setQueries([...queries].splice(0, 0, query as string[]));
      })
      .catch((e) => {
        e.then((error: {[key: string]: string[]}) => {
          console.error(error);
          invoke(showMessages(error.errors));
        });
      });
  }, [query, count, queries, store.dispatch, pageSize, page]);

  const rows = useMemo(() => {
    if (!data || !data.answer) return;

    let colMapping = data.format[1];
    // Need to order the results the same as `columns`
    return data.answer.map(([recordName, answer]: [string, any[]]) =>
      columns.map(({colId}) => answer[colMapping.indexOf(colId)])
    );
  }, [data, columns]);

  useEffect(() => {
    runQuery();
  }, [page, pageSize]);

  if (!state.rootModel || !state.rootIdentifier || 0 === columns.length)
    return null;

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
          <Grid item container alignItems='center' justify='flex-end'>
            <Typography component='div'>
              <Grid component='label' container alignItems='center' spacing={1}>
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
            <ButtonGroup
              variant='contained'
              color='primary'
              aria-label='contained primary button group'
            >
              <Button>Previous Queries</Button>
              <Button onClick={runQuery}>Query</Button>
              <Button>{'\u21af TSV'}</Button>
            </ButtonGroup>
          </Grid>
          <Grid item>
            <TableContainer component={Paper}>
              <Table
                className={classes.table}
                size='small'
                aria-label='result preview table'
              >
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QueryResults;
