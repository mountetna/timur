import React, {useCallback, useState, useEffect, useMemo} from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import {makeStyles} from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import {Attribute} from '../../models/model_types';

import useSliceMethods from './query_use_slice_methods';
import {QueryColumn} from '../../contexts/query/query_types';
import {
  selectAllowedModelAttributes,
  attributeIsFile
} from '../../selectors/query_selector';
import QuerySlicePane from './query_slice_pane';

import {visibleSortedAttributesWithUpdatedAt} from '../../utils/attributes';
import {QueryGraph} from '../../utils/query_graph';
import RemoveIcon from './query_remove_icon';
import CopyIcon from './query_copy_icon';
import Selector from './query_selector';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '80%',
    minWidth: 120
  },
  topMargin: {
    marginTop: '3px'
  }
}));

function id(label: string) {
  return `${label}-${Math.random()}`;
}

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

const FilePredicateSelector = React.memo(
  ({
    onSelect,
    value
  }: {
    onSelect: (newValue: string) => void;
    value: string;
  }) => {
    return (
      <Selector
        canEdit={true}
        label='Predicate'
        name={value || 'url'}
        onSelect={onSelect}
        choiceSet={['url', 'md5']}
      />
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
    onRemoveColumn,
    onCopyColumn,
    onSelectPredicate
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
    onCopyColumn: () => void;
    onSelectPredicate: (predicate: string) => void;
  }) => {
    const [selectableModelAttributes, setSelectableModelAttributes] = useState(
      [] as Attribute[]
    );
    // All the slices related to a given model / attribute,
    //   with the model / attribute as a "label".
    // Matrices will have modelName + attributeName.
    const [updateCounter, setUpdateCounter] = useState(0);

    const classes = useStyles();

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

    const showFilePredicates = useMemo(() => {
      return (
        column?.attribute_name &&
        attributeIsFile(graph.models, column.model_name, column.attribute_name)
      );
    }, [column, graph]);

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
          <Grid item xs={2}>
            <Selector
              canEdit={canEdit}
              label={label}
              name={column.model_name}
              onSelect={onSelectModel}
              choiceSet={modelChoiceSet}
            />
          </Grid>
          {column.model_name && selectableModelAttributes.length > 0 ? (
            <React.Fragment>
              <Grid item xs={3} container direction='row'>
                <Grid
                  item
                  xs={showFilePredicates ? 9 : 12}
                  className={classes.topMargin}
                >
                  <AttributeSelector
                    onSelect={onSelectAttribute}
                    canEdit={canEdit}
                    label={label}
                    attributeChoiceSet={selectableModelAttributes.sort()}
                    column={column}
                  />
                </Grid>
                {showFilePredicates ? (
                  <Grid item xs={3}>
                    <FilePredicateSelector
                      value={column.predicate || 'url'}
                      onSelect={onSelectPredicate}
                    />
                  </Grid>
                ) : null}
              </Grid>
              <Grid item xs={4}>
                {isSliceable && canEdit ? (
                  <QuerySlicePane column={column} columnIndex={columnIndex} />
                ) : null}
              </Grid>
            </React.Fragment>
          ) : (
            <Grid item xs={7}></Grid>
          )}
          <Grid item container justify='flex-end' xs={1}>
            <CopyIcon canEdit={canEdit} onClick={onCopyColumn} label='column' />
            <RemoveIcon
              canEdit={canEdit}
              onClick={onRemoveColumn}
              label='column'
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }
);

export default QueryModelAttributeSelector;
