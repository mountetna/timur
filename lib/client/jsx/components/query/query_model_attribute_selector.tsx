import React, {useCallback, useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {Attribute} from '../../models/model_types';

import useSliceMethods from './query_use_slice_methods';
import {QueryColumn} from '../../contexts/query/query_types';
import {selectAllowedModelAttributes} from '../../selectors/query_selector';
import QuerySlicePane from './query_slice_pane';

import {visibleSortedAttributesWithUpdatedAt} from '../../utils/attributes';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: 10,
    minWidth: 120
  },
  root: {
    minWidth: 345
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  fullWidth: {
    width: '96%',
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const RemoveColumnIcon = ({
  canRemove,
  removeColumn
}: {
  canRemove: boolean;
  removeColumn: () => void;
}) => {
  if (!canRemove) return null;

  return (
    <Tooltip title='Remove column' aria-label='remove column'>
      <IconButton aria-label='remove column' onClick={removeColumn}>
        <ClearIcon color='action' />
      </IconButton>
    </Tooltip>
  );
};

const QueryModelAttributeSelector = ({
  label,
  modelChoiceSet,
  column,
  columnIndex,
  onSelectModel,
  onSelectAttribute,
  removeColumn,
  canRemove
}: {
  label: string;
  modelChoiceSet: string[];
  column: QueryColumn;
  columnIndex: number;
  onSelectModel: (modelName: string) => void;
  onSelectAttribute: (attribute_name: string) => void;
  removeColumn: () => void;
  canRemove: boolean;
}) => {
  const [selectableModelAttributes, setSelectableModelAttributes] = useState(
    [] as Attribute[]
  );
  // All the slices related to a given model / attribute,
  //   with the model / attribute as a "label".
  // Matrices will have modelName + attributeName.
  const [updateCounter, setUpdateCounter] = useState(0);

  const classes = useStyles();

  let reduxState = useReduxState();

  const handleModelSelect = useCallback(
    (modelName: string) => {
      onSelectModel(modelName);
      if ('' !== modelName && modelName !== column.model_name) {
        let template = selectTemplate(reduxState, modelName);
        setSelectableModelAttributes(
          selectAllowedModelAttributes(
            visibleSortedAttributesWithUpdatedAt(template.attributes)
          )
        );
      }
    },
    [reduxState, onSelectModel, setSelectableModelAttributes, column.model_name]
  );

  const {matrixModelNames, collectionModelNames} = useSliceMethods(
    column,
    columnIndex,
    updateCounter,
    setUpdateCounter
  );

  const isSliceableAsMatrix = matrixModelNames.includes(column.model_name);
  const isSliceableAsCollection = collectionModelNames.includes(
    column.model_name
  );

  const isSliceable = isSliceableAsMatrix || isSliceableAsCollection;

  const id = `${label}-${Math.random()}`;

  console.log('selectableModelAttributes', selectableModelAttributes);
  console.log('column', column, modelChoiceSet);

  return (
    <Grid container alignItems='center' justify='flex-start'>
      <Grid item xs={2}>
        <FormControl className={classes.formControl}>
          <InputLabel shrink id={id}>
            {label}
          </InputLabel>
          <Select
            labelId={id}
            value={column.model_name}
            onChange={(e) => handleModelSelect(e.target.value as string)}
          >
            {modelChoiceSet.sort().map((model_name: string, index: number) => (
              <MenuItem key={index} value={model_name}>
                {model_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {column.model_name ? (
        <React.Fragment>
          <Grid
            item
            xs={9}
            container
            spacing={2}
            direction='column'
            key={column.model_name}
          >
            <Grid item xs={4}>
              <FormControl className={classes.fullWidth}>
                <Autocomplete
                  id={`${id}-attribute`}
                  value={selectableModelAttributes.find(
                    (a: Attribute) =>
                      a.attribute_name === column.attribute_name &&
                      a.model_name === column.model_name
                  )}
                  options={selectableModelAttributes.sort()}
                  getOptionLabel={(option) => option.attribute_name}
                  style={{width: 300}}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Attribute'
                      variant='outlined'
                    />
                  )}
                  onChange={(e, v) =>
                    onSelectAttribute(v?.attribute_name || '')
                  }
                />
              </FormControl>
            </Grid>
            {isSliceable ? (
              <Grid item>
                <QuerySlicePane column={column} columnIndex={columnIndex} />
              </Grid>
            ) : null}
          </Grid>
        </React.Fragment>
      ) : null}
      <Grid item xs={1}>
        <RemoveColumnIcon canRemove={canRemove} removeColumn={removeColumn} />
      </Grid>
    </Grid>
  );
};

export default QueryModelAttributeSelector;
