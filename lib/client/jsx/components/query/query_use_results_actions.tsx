import React, {useContext, useCallback} from 'react';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
import {requestAnswer} from 'etna-js/actions/magma_actions';
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

    setDataAndNumRecords(EmptyQueryResponse, 0);
    invoke(requestAnswer({query: countQuery}))
      .then((countData: any) => {
        numRecords = countData.answer;
        return invoke(
          requestAnswer({query, page_size: pageSize, page: page + 1})
        );
      })
      .then((answerData: any) => {
        setDataAndNumRecords(answerData, numRecords);
        // setQueries([...queries].splice(0, 0, builder));
      })
      .catch((e: any) => {
        e.then((error: {[key: string]: string[]}) => {
          console.error(error);
          invoke(showMessages(error.errors || [error.error] || error));
        });
      });
  }, [query, countQuery, pageSize, page, invoke, setDataAndNumRecords]);

  const downloadData = useCallback(() => {
    if ('' === query) return;

    invoke(requestAnswer({query}))
      .then((allData: any) => {
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
      .catch((e: any) => {
        e.then((error: {[key: string]: string[]}) => {
          console.error(error);
          invoke(showMessages(error.errors || [error.error] || error));
        });
      });
  }, [query, formattedColumns, formatRowData, invoke, rootModel]);

  return {
    runQuery,
    downloadData
  };
};

export default useResultsActions;
