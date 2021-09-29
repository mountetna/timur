import React, {useMemo, useContext, useCallback} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import {makeStyles} from '@material-ui/core/styles';

import {QueryColumn} from '../../contexts/query/query_types';
import {QueryGraphContext} from '../../contexts/query/query_graph_context';
import {QueryColumnContext} from '../../contexts/query/query_column_context';
import QueryModelAttributeSelector from './query_model_attribute_selector';
import QueryClause from './query_clause';

const useStyles = makeStyles((theme) => ({
  displayLabel: {
    marginBottom: 10,
    paddingLeft: 10
  }
}));

const QuerySelectPane = () => {
  const {
    state: {graph, rootModel}
  } = useContext(QueryGraphContext);
  const {
    state: {columns},
    addQueryColumn,
    patchQueryColumn,
    removeQueryColumn
  } = useContext(QueryColumnContext);
  const classes = useStyles();

  const handleOnSelectModel = useCallback(
    (columnIndex: number, modelName: string) => {
      patchQueryColumn(columnIndex, {
        model_name: modelName,
        slices: [],
        attribute_name: '',
        display_label: ''
      });
    },
    [patchQueryColumn]
  );

  const handleOnSelectAttribute = useCallback(
    (columnIndex: number, modelName: string, attributeName: string) => {
      patchQueryColumn(columnIndex, {
        model_name: modelName,
        slices: [],
        attribute_name: attributeName,
        display_label: `${modelName}.${attributeName}`
      });
    },
    [patchQueryColumn]
  );

  const handleOnChangeLabel = useCallback(
    (columnIndex: number, column: QueryColumn, label: string) => {
      patchQueryColumn(columnIndex, {
        ...column,
        display_label: label
      });
    },
    [patchQueryColumn]
  );

  const handleOnRemoveColumn = useCallback(
    (columnIndex: number) => {
      removeQueryColumn(columnIndex);
    },
    [removeQueryColumn]
  );

  const modelChoiceSet = useMemo(
    () => [
      ...new Set(
        graph
          .allPaths(rootModel)
          .flat()
          .concat(rootModel ? [rootModel] : [])
      )
    ],
    [graph, rootModel]
  );

  if (!rootModel) return null;

  return (
    <QueryClause title='Columns'>
      <Grid className={classes.displayLabel} container>
        <Grid item xs={2}>
          <Typography>Display Label</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>Model</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Attribute</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography>Slices</Typography>
        </Grid>
      </Grid>
      {columns.map((column: QueryColumn, index: number) => {
        return (
          <QueryModelAttributeSelector
            key={index}
            label='Join Model'
            column={column}
            modelChoiceSet={modelChoiceSet}
            columnIndex={index}
            canEdit={0 !== index}
            graph={graph}
            onSelectModel={(modelName) => handleOnSelectModel(index, modelName)}
            onSelectAttribute={(attributeName) =>
              handleOnSelectAttribute(index, column.model_name, attributeName)
            }
            onChangeLabel={(label) => handleOnChangeLabel(index, column, label)}
            onRemoveColumn={() => handleOnRemoveColumn(index)}
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
