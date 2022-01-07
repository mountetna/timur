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
  queryColumnMatrixHeadings,
  isIdentifierQuery
} from '../../selectors/query_selector';
import {QueryGraph} from '../../utils/query_graph';

const useTableEffects = ({
  columns,
  data,
  graph,
  expandMatrices,
  maxColumns
}: {
  columns: QueryColumn[];
  data: QueryResponse;
  expandMatrices: boolean;
  graph: QueryGraph;
  maxColumns: number;
}) => {
  function generateIdCol(attr: QueryColumn, index: number): string {
    // Subtract one from index to account for shift without identifier in format
    return `${CONFIG.project_name}::${attr.model_name}#${attr.attribute_name}@${
      index - 1
    }`;
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
        let template = graph.template(column.model_name);

        if (!template) return acc;

        let isMatrix: boolean = attributeIsMatrix(
          graph.models,
          column.model_name,
          column.attribute_name
        );

        let matrixHeadings: string[] = [];

        if (hasMatrixSlice(column)) {
          matrixHeadings = queryColumnMatrixHeadings(column);
        } else {
          matrixHeadings = isMatrix ? validationValues(column) : [];
        }

        if (expandMatrices && isMatrix) {
          matrixHeadings.forEach((heading) => {
            acc.push({
              label: `${column.display_label}.${heading}`,
              colId: `${generateIdCol(column, index)}.${heading}`,
              modelName: column.model_name,
              attribute: template.attributes[column.attribute_name],
              matrixHeadings
            });
          });
        } else {
          acc.push({
            label: column.display_label,
            colId: generateIdCol(column, index),
            modelName: column.model_name,
            attribute: template.attributes[column.attribute_name],
            matrixHeadings
          });
        }

        return acc;
      },
      []
    );
  }, [columns, graph, expandMatrices, validationValues]);

  const formatRowData = useCallback(
    (allData: QueryResponse, cols: QueryTableColumn[]) => {
      let colMapping = allData.format[1];
      // Need to order the results the same as `columns`
      return allData.answer.map(([recordName, answer]: [string, any[]]) =>
        cols.map(({colId}, index: number) =>
          index === 0
            ? recordName
            : _.at(answer, pathToColumn(colMapping, colId, expandMatrices))[0]
        )
      );
    },
    [expandMatrices]
  );

  const rows = useMemo(() => {
    if (!data || !data.answer || data.answer.length === 0) return;

    // Need to order the results the same as `formattedColumns`
    return formatRowData(data, formattedColumns.slice(0, maxColumns));
  }, [data, formattedColumns, formatRowData, maxColumns]);

  return {
    columns: formattedColumns,
    rows,
    formatRowData
  };
};

export default useTableEffects;
