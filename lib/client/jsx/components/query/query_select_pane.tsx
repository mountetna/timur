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
  },
  sliceHeading: {
    paddingRight: '20px'
  },
  sliceSubheading: {
    color: 'gray',
    fontSize: '0.9rem'
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
    (columnIndex: number, modelName: string, displayLabel: string) => {
      patchQueryColumn(columnIndex, {
        model_name: modelName,
        slices: [],
        attribute_name: '',
        display_label: displayLabel
      });
    },
    [patchQueryColumn]
  );

  const handleOnSelectAttribute = useCallback(
    (columnIndex: number, column: QueryColumn, attributeName: string) => {
      patchQueryColumn(columnIndex, {
        model_name: column.model_name,
        slices: [],
        attribute_name: attributeName,
        display_label: `${
          column.display_label === ''
            ? `${column.model_name}.${attributeName}`
            : column.display_label
        }`
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
        <Grid item xs={2}>
          <Typography>Model</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Attribute</Typography>
        </Grid>
        <Grid item xs={5} className={classes.sliceHeading}>
          <Typography>Slices</Typography>
          <Grid item container>
            <Grid
              xs={11}
              item
              container
              spacing={1}
              alignItems='center'
              className={classes.sliceSubheading}
            >
              <Grid item xs={3}>
                Model
              </Grid>
              <Grid item xs={3}>
                Attribute
              </Grid>
              <Grid item xs={2}>
                Operator
              </Grid>
              <Grid item xs={3}>
                Operand
              </Grid>
              <Grid item xs={1} />
            </Grid>
            <Grid item xs={1} />
          </Grid>
        </Grid>
        <Grid item xs={1} />
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
            onSelectModel={(modelName) =>
              handleOnSelectModel(index, modelName, column.display_label)
            }
            onSelectAttribute={(attributeName) =>
              handleOnSelectAttribute(index, column, attributeName)
            }
            onChangeLabel={(label) => handleOnChangeLabel(index, column, label)}
            onRemoveColumn={() => handleOnRemoveColumn(index)}
            onCopyColumn={() => addQueryColumn({...column})}
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
