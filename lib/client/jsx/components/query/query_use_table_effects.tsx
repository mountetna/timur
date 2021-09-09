import React, {useMemo, useContext, useCallback} from 'react';
import * as _ from 'lodash';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectModels} from 'etna-js/selectors/magma';
import {QueryContext} from '../../contexts/query/query_context';
import {
  QueryColumn,
  QueryResponse,
  QueryTableColumn
} from '../../contexts/query/query_types';
import {
  pathToColumn,
  attributeIsMatrix,
  hasMatrixSlice,
  isMatrixSlice
} from '../../selectors/query_selector';

const useTableEffects = (data: QueryResponse, expandMatrices: boolean) => {
  let {state} = useContext(QueryContext);
  const reduxState = useReduxState();

  function generateIdCol(attr: QueryColumn, index: number): string {
    return `${CONFIG.project_name}::${attr.model_name}#${attr.attribute_name}@${index}`;
  }

  const columns = useMemo(() => {
    if (!state.rootIdentifier) return [];

    return state.columns.reduce(
      (acc: QueryTableColumn[], column: QueryColumn, index: number) => {
        if (
          expandMatrices &&
          attributeIsMatrix(
            selectModels(reduxState),
            column.model_name,
            column.attribute_name
          ) &&
          hasMatrixSlice(column)
        ) {
          column.slices
            .filter((slice) => isMatrixSlice(slice))
            .forEach((slice) => {
              (slice.operand as string).split(',').forEach((heading) => {
                acc.push({
                  label: `${column.display_label}.${heading}`,
                  colId: `${generateIdCol(column, index)}.${heading}`
                });
              });
            });
        } else {
          acc.push({
            label: column.display_label,
            colId: generateIdCol(column, index)
          });
        }

        return acc;
      },
      []
    );
  }, [state.columns, state.rootIdentifier, reduxState, expandMatrices]);

  const formatRowData = useCallback(
    (allData: QueryResponse, cols: QueryTableColumn[]) => {
      let colMapping = allData.format[1];
      // Need to order the results the same as `columns`
      return allData.answer.map(([recordName, answer]: [string, any[]]) =>
        cols.map(({colId}) => {
          console.log(
            'answer',
            answer,
            colId,
            colMapping,
            pathToColumn(colMapping, colId, expandMatrices)
          );
          return _.at(
            answer,
            pathToColumn(colMapping, colId, expandMatrices)
          )[0];
        })
      );
    },
    [expandMatrices]
  );

  const rows = useMemo(() => {
    if (!data || !data.answer) return;

    // Need to order the results the same as `columns`
    return formatRowData(data, columns);
  }, [data, columns, formatRowData]);

  return {
    columns,
    rows,
    formatRowData
  };
};

export default useTableEffects;
