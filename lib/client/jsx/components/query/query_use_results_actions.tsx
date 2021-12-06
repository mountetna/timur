import React, {useCallback, useMemo} from 'react';

import downloadjs from 'downloadjs';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
import {requestAnswer} from 'etna-js/actions/magma_actions';
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
  const invoke = useActionInvoker();

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

    invoke(
      requestAnswer({
        query,
        format: 'tsv',
        user_columns: userColumns,
        expand_matrices: expandMatrices
      })
    )
      .then((answer: any) => {
        downloadjs(
          answer,
          `${
            CONFIG.project_name
          }-query-results-${new Date().toISOString()}.tsv`,
          'text/tsv'
        );
      })
      .catch((error: any) => {
        Promise.resolve(error).then((e) => {
          console.error(e);
          invoke(showMessages(e.errors || [e.toString()]));
        });
      });
  }, [query, userColumns, invoke, expandMatrices]);

  return {
    runQuery,
    downloadData
  };
};

export default useResultsActions;
