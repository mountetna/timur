import React, {useMemo, useCallback} from 'react';
import * as _ from 'lodash';

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
import {QueryGraph} from '../../utils/query_graph';

const useTableEffects = ({
  columns,
  data,
  graph,
  expandMatrices
}: {
  columns: QueryColumn[];
  data: QueryResponse;
  expandMatrices: boolean;
  graph: QueryGraph;
}) => {
  function generateIdCol(attr: QueryColumn, index: number): string {
    return `${CONFIG.project_name}::${attr.model_name}#${attr.attribute_name}@${index}`;
  }

  const validationValues = useCallback(
    (column: QueryColumn) => {
      return (graph.models[column.model_name]?.template.attributes[
        column.attribute_name
      ]?.validation?.value || []) as string[];
    },
    [graph.models]
  );

  const formattedColumns = useMemo(() => {
    return columns.reduce(
      (acc: QueryTableColumn[], column: QueryColumn, index: number) => {
        if (
          expandMatrices &&
          attributeIsMatrix(
            graph.models,
            column.model_name,
            column.attribute_name
          )
        ) {
          let matrixHeadings: string[] = [];

          if (hasMatrixSlice(column)) {
            matrixHeadings = column.slices
              .filter((slice) => isMatrixSlice(slice))
              .map((slice) => {
                return (slice.operand as string).split(',');
              })
              .flat();
          } else {
            matrixHeadings = validationValues(column);
          }

          matrixHeadings.forEach((heading) => {
            acc.push({
              label: `${column.display_label}.${heading}`,
              colId: `${generateIdCol(column, index)}.${heading}`
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
  }, [columns, graph, expandMatrices]);

  const formatRowData = useCallback(
    (allData: QueryResponse, cols: QueryTableColumn[]) => {
      let colMapping = allData.format[1];
      // Need to order the results the same as `columns`
      return allData.answer.map(([recordName, answer]: [string, any[]]) =>
        cols.map(
          ({colId}) =>
            _.at(answer, pathToColumn(colMapping, colId, expandMatrices))[0]
        )
      );
    },
    [expandMatrices]
  );

  const rows = useMemo(() => {
    if (!data || !data.answer) return;

    // Need to order the results the same as `formattedColumns`
    return formatRowData(data, formattedColumns);
  }, [data, formattedColumns, formatRowData]);

  return {
    columns: formattedColumns,
    rows,
    formatRowData
  };
};

export default useTableEffects;
