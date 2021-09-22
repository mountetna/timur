import React, {useContext} from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import {QueryColumn} from '../../contexts/query/query_types';
import {QueryContext} from '../../contexts/query/query_context';
import QueryModelAttributeSelector from './query_model_attribute_selector';
import QueryClause from './query_clause';

const QuerySelectPane = () => {
  const {
    state: {rootModel, columns},
    addQueryColumn
  } = useContext(QueryContext);

  if (!rootModel) return null;

  return (
    <QueryClause title='Columns'>
      {columns.map((column: QueryColumn, index: number) => {
        return (
          <QueryModelAttributeSelector
            key={index}
            label='Join Model'
            columnIndex={index}
            canEdit={0 !== index}
          />
        );
      })}
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
        className='query-add-column-btn'
      >
        Column
      </Button>
    </QueryClause>
  );
};

export default QuerySelectPane;
