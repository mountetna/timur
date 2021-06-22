import React, {useMemo, useContext} from 'react';
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
  isMatchingMatrixSlice
} from '../../selectors/query_selector';

const useTableEffects = (data: QueryResponse, expandMatrices: boolean) => {
  let {state} = useContext(QueryContext);
  const reduxState = useReduxState();

  function generateIdCol(attr: QueryColumn): string {
    return `${CONFIG.project_name}::${attr.model_name}#${attr.attribute_name}`;
  }

  const columns = useMemo(() => {
    if (!state.rootIdentifier) return [];

    let colDefs: QueryTableColumn[] = [
      {
        colId: generateIdCol(state.rootIdentifier),
        label: state.rootIdentifier.display_label
      }
    ];

    return colDefs.concat(
      Object.values(state.attributes || {})
        .flat()
        .reduce((acc: QueryTableColumn[], attr) => {
          if (
            expandMatrices &&
            attributeIsMatrix(
              selectModels(reduxState),
              attr.model_name,
              attr.attribute_name
            ) &&
            hasMatrixSlice(Object.values(state.slices).flat(), attr)
          ) {
            Object.values(state.slices)
              .flat()
              .filter((slice) => isMatchingMatrixSlice(slice, attr))
              .forEach((slice) => {
                (slice.operand as string).split(',').forEach((heading) => {
                  acc.push({
                    label: `${attr.display_label}.${heading}`,
                    colId: `${generateIdCol(attr)}.${heading}`
                  });
                });
              });
          } else {
            acc.push({
              label: attr.display_label,
              colId: generateIdCol(attr)
            });
          }

          return acc;
        }, [])
    );
  }, [
    state.attributes,
    state.rootIdentifier,
    state.slices,
    reduxState,
    expandMatrices
  ]);

  function formatRowData(allData: QueryResponse, cols: QueryTableColumn[]) {
    let colMapping = allData.format[1];
    // Need to order the results the same as `columns`
    return allData.answer.map(([recordName, answer]: [string, any[]]) =>
      cols.map(
        ({colId}) =>
          _.at(answer, pathToColumn(colMapping, colId, expandMatrices))[0]
      )
    );
  }

  const rows = useMemo(() => {
    if (!data || !data.answer) return;

    // Need to order the results the same as `columns`
    return formatRowData(data, columns);
  }, [data, columns]);

  return {
    columns,
    rows,
    formatRowData
  };
};

export default useTableEffects;
