import React, {useCallback, useState, useContext, useEffect} from 'react';
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
import Paper from '@material-ui/core/Paper';

import {Attribute} from '../../models/model_types';

import useSliceMethods from './query_use_slice_methods';
import {QueryColumn} from '../../contexts/query/query_types';
import {selectAllowedModelAttributes} from '../../selectors/query_selector';
import QuerySlicePane from './query_slice_pane';

import {visibleSortedAttributesWithUpdatedAt} from '../../utils/attributes';
import {QueryGraph} from '../../utils/query_graph';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: 10,
    minWidth: 120
  },
  fullWidth: {
    width: '80%',
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const RemoveColumnIcon = React.memo(
  ({canEdit, removeColumn}: {canEdit: boolean; removeColumn: () => void}) => {
    if (!canEdit) return null;

    return (
      <Tooltip title='Remove column' aria-label='remove column'>
        <IconButton aria-label='remove column' onClick={removeColumn}>
          <ClearIcon color='action' />
        </IconButton>
      </Tooltip>
    );
  }
);

function id(label: string) {
  return `${label}-${Math.random()}`;
}

const ModelNameSelector = React.memo(
  ({
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
  }
);

const AttributeSelector = React.memo(
  ({
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

    if (!canEdit)
      return (
        <TextField
          disabled
          value={column.attribute_name}
          className='query-column-attribute'
        />
      );

    return (
      <FormControl className={classes.fullWidth}>
        <Autocomplete
          id={`${id(label)}-attribute`}
          value={
            attributeChoiceSet.find(
              (a: Attribute) => a.attribute_name === column.attribute_name
            ) || null
          }
          options={attributeChoiceSet}
          getOptionLabel={(option) => option.attribute_name}
          renderInput={(params) => <TextField {...params} />}
          onChange={(e, v) => onSelect(v?.attribute_name || '')}
        />
      </FormControl>
    );
  }
);

const QueryModelAttributeSelector = React.memo(
  ({
    label,
    column,
    columnIndex,
    canEdit,
    modelChoiceSet,
    graph,
    onSelectModel,
    onSelectAttribute,
    onChangeLabel,
    onRemoveColumn
  }: {
    label: string;
    column: QueryColumn;
    columnIndex: number;
    canEdit: boolean;
    modelChoiceSet: string[];
    graph: QueryGraph;
    onSelectModel: (modelName: string) => void;
    onSelectAttribute: (attributeName: string) => void;
    onChangeLabel: (label: string) => void;
    onRemoveColumn: () => void;
  }) => {
    const [selectableModelAttributes, setSelectableModelAttributes] = useState(
      [] as Attribute[]
    );
    // All the slices related to a given model / attribute,
    //   with the model / attribute as a "label".
    // Matrices will have modelName + attributeName.
    const [updateCounter, setUpdateCounter] = useState(0);

    const selectAttributesForModel = useCallback(
      (modelName: string) => {
        let template = graph.template(modelName);
        setSelectableModelAttributes(
          selectAllowedModelAttributes(
            visibleSortedAttributesWithUpdatedAt(template.attributes)
          )
        );
      },
      [graph]
    );

    useEffect(() => {
      if (column?.model_name && graph.template(column.model_name)) {
        selectAttributesForModel(column.model_name);
      }
    }, [graph, column, selectAttributesForModel]);

    const {matrixModelNames, collectionModelNames} = useSliceMethods(
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
      <Paper>
        <Grid
          container
          alignItems='center'
          justify='flex-start'
          className='query-column-selector'
        >
          <Grid item xs={2}>
            <TextField
              value={column.display_label}
              onChange={(e) => onChangeLabel(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <ModelNameSelector
              canEdit={canEdit}
              label={label}
              modelName={column.model_name}
              onSelect={onSelectModel}
              modelChoiceSet={modelChoiceSet}
            />
          </Grid>
          {column.model_name && selectableModelAttributes.length > 0 ? (
            <React.Fragment>
              <Grid item xs={2}>
                <AttributeSelector
                  onSelect={onSelectAttribute}
                  canEdit={canEdit}
                  label={label}
                  attributeChoiceSet={selectableModelAttributes.sort()}
                  column={column}
                />
              </Grid>
              <Grid item xs={6}>
                {isSliceable && canEdit ? (
                  <QuerySlicePane column={column} columnIndex={columnIndex} />
                ) : null}
              </Grid>
            </React.Fragment>
          ) : (
            <Grid item xs={8}></Grid>
          )}
          <Grid item container justify='flex-end' xs={1}>
            <RemoveColumnIcon canEdit={canEdit} removeColumn={onRemoveColumn} />
          </Grid>
        </Grid>
      </Paper>
    );
  }
);

export default QueryModelAttributeSelector;
