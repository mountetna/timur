import React, {useCallback, useMemo} from 'react';

import downloadjs from 'downloadjs';

import {useModal} from 'etna-js/components/ModalDialogContainer';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
import {requestAnswer} from 'etna-js/actions/magma_actions';
import {
  QueryResponse,
  EmptyQueryResponse,
  QueryColumn
} from '../../contexts/query/query_types';
import {Cancellable} from 'etna-js/utils/cancellable';
import {userColumns} from '../../selectors/query_selector';

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
  const invoke = useActionInvoker();
  const {dismissModal} = useModal();

  const runQuery = useCallback(() => {
    if ('' === countQuery || '' === query) return;

    let numRecords = 0;

    setDataAndNumRecords(EmptyQueryResponse, 0);
    invoke(requestAnswer({query: countQuery}))
      .then((countData: {answer: number}) => {
        numRecords = countData.answer;
        return invoke(
          requestAnswer({query, page_size: pageSize, page: page + 1})
        );
      })
      .then((answerData: QueryResponse) => {
        setDataAndNumRecords(answerData, numRecords);
        // setQueries([...queries].splice(0, 0, builder));
      })
      .catch((e: any) => {
        Promise.resolve(e).then((error: {[key: string]: string[]}) => {
          console.error(error);
          invoke(showMessages(error.errors || [error.error] || error));
        });
      });
  }, [query, countQuery, pageSize, page, invoke, setDataAndNumRecords]);

  const downloadData = useCallback(
    ({transpose}: {transpose: boolean}) => {
      if ('' === query) return;

      const cancellable = new Cancellable();

      cancellable
        .race(
          invoke(
            requestAnswer({
              query,
              format: 'tsv',
              user_columns: userColumns(columns),
              expand_matrices: expandMatrices,
              transpose
            })
          )
        )
        .then(({result, cancelled}: any) => {
          if (result && !cancelled) {
            downloadjs(
              result,
              `${
                CONFIG.project_name
              }-query-results-${new Date().toISOString()}.tsv`,
              'text/tsv'
            );
            dismissModal();
          }
        })
        .catch((error: any) => {
          Promise.resolve(error).then((e) => {
            console.error(e);
            invoke(showMessages(e.errors || [e.toString()]));
          });
        });

      return () => cancellable.cancel();
    },
    [query, columns, invoke, expandMatrices, dismissModal]
  );

  return {
    runQuery,
    downloadData
  };
};

export default useResultsActions;
