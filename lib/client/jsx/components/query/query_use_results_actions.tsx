import React, {useContext, useCallback} from 'react';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
import {getAnswer} from 'etna-js/api/magma_api';
import {requestQueryTSV} from 'etna-js/actions/magma_actions';
import {Exchange} from 'etna-js/actions/exchange_actions';
import {ReactReduxContext} from 'react-redux';
import {
  QueryResponse,
  EmptyQueryResponse,
  QueryTableColumn
} from '../../contexts/query/query_types';

const useResultsActions = ({
  countQuery,
  query,
  page,
  pageSize,
  rootModel,
  formattedColumns,
  setDataAndNumRecords,
  formatRowData
}: {
  countQuery: string | any[];
  query: string | any[];
  page: number;
  pageSize: number;
  rootModel: string | null;
  formattedColumns: QueryTableColumn[];
  setDataAndNumRecords: (data: QueryResponse, count: number) => void;
  formatRowData: (data: QueryResponse, columns: QueryTableColumn[]) => any[];
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

  const downloadData = useCallback(() => {
    if ('' === query) return;

    invoke(
      requestQueryTSV({
        query,
        user_columns: formattedColumns.map(({label}: {label: string}) => label)
      })
    );
  }, [query, formattedColumns, invoke]);

  return {
    runQuery,
    downloadData
  };
};

export default useResultsActions;
