import React, {useCallback, useState} from 'react';
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
import Typography from '@material-ui/core/Typography';

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
  canEdit,
  removeColumn
}: {
  canEdit: boolean;
  removeColumn: () => void;
}) => {
  if (!canEdit) return null;

  return (
    <Tooltip title='Remove column' aria-label='remove column'>
      <IconButton aria-label='remove column' onClick={removeColumn}>
        <ClearIcon color='action' />
      </IconButton>
    </Tooltip>
  );
};

function id(label: string) {
  return `${label}-${Math.random()}`;
}

const ModelNameSelector = ({
  canEdit,
  onSelect,
  label,
  modelName,
  modelChoiceSet
}: {
  canEdit: boolean;
  onSelect: (modelName: string) => void;
  label: string;
  modelName: string;
  modelChoiceSet: string[];
}) => {
  const classes = useStyles();

  if (!canEdit) return <Typography>{modelName}</Typography>;

  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink id={id(label)}>
        {label}
      </InputLabel>
      <Select
        labelId={id(label)}
        value={modelName}
        onChange={(e) => onSelect(e.target.value as string)}
      >
        {modelChoiceSet.sort().map((model_name: string, index: number) => (
          <MenuItem key={index} value={model_name}>
            {model_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const AttributeSelector = ({
  onSelect,
  canEdit,
  attributeChoiceSet,
  column,
  label
}: {
  label: string;
  column: QueryColumn;
  attributeChoiceSet: Attribute[];
  canEdit: boolean;
  onSelect: (attributeName: string) => void;
}) => {
  const classes = useStyles();

  if (!canEdit) return <Typography>{column.attribute_name}</Typography>;

  return (
    <FormControl className={classes.fullWidth}>
      <Autocomplete
        id={`${id(label)}-attribute`}
        value={attributeChoiceSet.find(
          (a: Attribute) =>
            a.attribute_name === column.attribute_name &&
            a.model_name === column.model_name
        )}
        options={attributeChoiceSet.sort()}
        getOptionLabel={(option) => option.attribute_name}
        style={{width: 300}}
        renderInput={(params) => (
          <TextField {...params} label='Attribute' variant='outlined' />
        )}
        onChange={(e, v) => onSelect(v?.attribute_name || '')}
      />
    </FormControl>
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
  canEdit
}: {
  label: string;
  modelChoiceSet: string[];
  column: QueryColumn;
  columnIndex: number;
  onSelectModel: (modelName: string) => void;
  onSelectAttribute: (attribute_name: string) => void;
  removeColumn: () => void;
  canEdit: boolean;
}) => {
  const [selectableModelAttributes, setSelectableModelAttributes] = useState(
    [] as Attribute[]
  );
  // All the slices related to a given model / attribute,
  //   with the model / attribute as a "label".
  // Matrices will have modelName + attributeName.
  const [updateCounter, setUpdateCounter] = useState(0);

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

  return (
    <Grid
      container
      alignItems='center'
      justify='flex-start'
      className='query-column-selector'
    >
      <Grid item xs={2}>
        <ModelNameSelector
          canEdit={canEdit}
          label={label}
          modelName={column.model_name}
          onSelect={handleModelSelect}
          modelChoiceSet={modelChoiceSet}
        />
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
              <AttributeSelector
                onSelect={onSelectAttribute}
                canEdit={canEdit}
                label={label}
                attributeChoiceSet={selectableModelAttributes}
                column={column}
              />
            </Grid>
            {isSliceable && canEdit ? (
              <Grid item>
                <QuerySlicePane column={column} columnIndex={columnIndex} />
              </Grid>
            ) : null}
          </Grid>
        </React.Fragment>
      ) : null}
      <Grid item xs={1}>
        <RemoveColumnIcon canEdit={canEdit} removeColumn={removeColumn} />
      </Grid>
    </Grid>
  );
};

export default QueryModelAttributeSelector;
