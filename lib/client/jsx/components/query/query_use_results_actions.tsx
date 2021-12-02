import React, {useContext, useCallback, useMemo} from 'react';

import downloadjs from 'downloadjs';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
import {getAnswer} from 'etna-js/api/magma_api';
import {Exchange} from 'etna-js/actions/exchange_actions';
import {ReactReduxContext} from 'react-redux';
import {
  QueryResponse,
  EmptyQueryResponse,
  QueryColumn
} from '../../contexts/query/query_types';

const useResultsActions = ({
  countQuery,
  query,
  page,
  pageSize,
  columns,
  expandMatrices,
  setDataAndNumRecords
}: {
  countQuery: string | any[];
  query: string | any[];
  page: number;
  pageSize: number;
  columns: QueryColumn[];
  expandMatrices: boolean;
  setDataAndNumRecords: (data: QueryResponse, count: number) => void;
}) => {
  let {store} = useContext(ReactReduxContext);
  const invoke = useActionInvoker();

  const runQuery = useCallback(() => {
    if ('' === countQuery || '' === query) return;

    let numRecords = 0;

    let exchange = new Exchange(store.dispatch, 'query-post-magma');
    setDataAndNumRecords(EmptyQueryResponse, 0);
    getAnswer({query: countQuery}, exchange.fetch.bind(exchange))
      .then((countData) => {
        numRecords = countData.answer;
        return getAnswer(
          {query, page_size: pageSize, page: page + 1},
          exchange.fetch.bind(exchange)
        );
      })
      .then((answerData) => {
        setDataAndNumRecords(answerData, numRecords);
        // setQueries([...queries].splice(0, 0, builder));
      })
      .catch((e) => {
        e.then((error: {[key: string]: string[]}) => {
          console.error(error);
          invoke(showMessages(error.errors || [error.error] || error));
        });
      });
  }, [
    query,
    countQuery,
    pageSize,
    page,
    invoke,
    store.dispatch,
    setDataAndNumRecords
  ]);

  const userColumns = useMemo(() => {
    let columnLabels = columns.map(
      ({display_label}: {display_label: string}) => display_label
    );

    // We need to duplicate the identifier column when renaming,
    //   since that is provided as the root of the question.answer.
    return [columnLabels[0], ...columnLabels];
  }, [columns]);

  const downloadData = useCallback(() => {
    if ('' === query) return;

    let exchange = new Exchange(store.dispatch, 'query-post-tsv-magma');
    getAnswer(
      {
        query,
        format: 'tsv',
        user_columns: userColumns,
        expand_matrices: expandMatrices
      },
      exchange.fetch.bind(exchange)
    )
      .then((answer) => {
        downloadjs(
          answer,
          `${
            CONFIG.project_name
          }-query-results-${new Date().toISOString()}.tsv`,
          'text/tsv'
        );
      })
      .catch((error) => {
        Promise.resolve(error).then((e) => {
          console.error(e);
          invoke(showMessages(e.errors || [e.toString()]));
        });
      });
  }, [query, userColumns, store.dispatch, invoke, expandMatrices]);

  return {
    runQuery,
    downloadData
  };
};

export default useResultsActions;
