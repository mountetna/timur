import React, {useContext} from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import {QueryColumn} from '../../contexts/query/query_types';
import {QueryContext} from '../../contexts/query/query_context';
import QueryModelAttributeSelector from './query_model_attribute_selector';
import QueryClause from './query_clause';

const QuerySelectPane = () => {
  const {state, addQueryColumn, removeQueryColumn, patchQueryColumn} =
    useContext(QueryContext);

  if (!state.rootModel) return null;

  let choiceSet = [
    ...new Set(
      state.graph.allPaths(state.rootModel).flat().concat(state.rootModel)
    )
  ];

  return (
    <QueryClause title='Columns'>
      {state.columns.map((column: QueryColumn, index: number) => {
        if (!state.rootModel) return;

        return (
          <QueryModelAttributeSelector
            key={index}
            label='Join Model'
            column={column}
            columnIndex={index}
            modelChoiceSet={choiceSet}
            onSelectModel={(newModelName) =>
              patchQueryColumn(index, {
                model_name: newModelName,
                slices: [],
                attribute_name: '',
                display_label: ''
              })
            }
            onSelectAttribute={(attributeName) =>
              patchQueryColumn(index, {
                model_name: column.model_name,
                slices: [],
                attribute_name: attributeName,
                display_label: `${column.model_name}.${attributeName}`
              })
            }
            canEdit={0 !== index}
            removeColumn={() => removeQueryColumn(index)}
          />
        );
      })}
      {state.rootModel ? (
        <Button
          onClick={() =>
            addQueryColumn({
              slices: [],
              model_name: '',
              attribute_name: '',
              display_label: ''
            })
          }
          startIcon={<AddIcon />}
        >
          Column
        </Button>
      ) : null}
    </QueryClause>
  );
};

export default QuerySelectPane;
