import React, {useContext, useCallback} from 'react';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
import {getAnswer} from 'etna-js/api/magma_api';
import {Exchange} from 'etna-js/actions/exchange_actions';
import {downloadTSV, MatrixDatum} from 'etna-js/utils/tsv';
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
    getAnswer({query: countQuery}, exchange)
      .then((countData) => {
        numRecords = countData.answer;
        return getAnswer(
          {query, page_size: pageSize, page: page + 1},
          exchange
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

    let exchange = new Exchange(store.dispatch, 'query-download-tsv-magma');
    getAnswer({query}, exchange)
      .then((allData) => {
        let rowData = formatRowData(allData, formattedColumns);
        let matrixMap = rowData.map((row: any) => {
          return formattedColumns.reduce(
            (acc: MatrixDatum, {label}: {label: string}, i: number) => {
              return {...acc, [label]: row[i]};
            },
            {}
          );
        }, []);

        downloadTSV(
          matrixMap,
          formattedColumns.map(({label}: {label: string}) => label),
          `${rootModel}-${new Date().toISOString()}` // at some point include the builder hash?
        );
      })
      .catch((e) => {
        e.then((error: {[key: string]: string[]}) => {
          console.error(error);
          invoke(showMessages(error.errors || [error.error] || error));
        });
      });
  }, [
    query,
    store.dispatch,
    formattedColumns,
    formatRowData,
    invoke,
    rootModel
  ]);

  return {
    runQuery,
    downloadData
  };
};

export default useResultsActions;
