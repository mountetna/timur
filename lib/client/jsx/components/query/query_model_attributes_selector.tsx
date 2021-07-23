import React, {
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useState
} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from '@material-ui/core/styles';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {QueryContext} from '../../contexts/query/query_context';
import {Attribute} from '../../models/model_types';

import useSliceMethods from './query_use_slice_methods';
import {QueryColumn} from '../../contexts/query/query_types';
import QueryAttributesModal from './query_attributes_modal';
import {
  hasMatrixSlice,
  selectAllowedModelAttributes
} from '../../selectors/query_selector';
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
  }
}));

const RemoveModelIcon = ({
  canRemove,
  removeModel
}: {
  canRemove: boolean;
  removeModel: () => void;
}) => {
  if (!canRemove) return null;

  return (
    <Tooltip
      title='Remove model and attributes'
      aria-label='remove model and attributes'
    >
      <IconButton
        aria-label='remove model and attributes'
        onClick={removeModel}
      >
        <ClearIcon color='action' />
      </IconButton>
    </Tooltip>
  );
};

const QueryModelAttributeSelector = ({
  label,
  modelChoiceSet,
  modelValue,
  selectedAttributes,
  onSelectModel,
  onSelectAttributes,
  removeModel,
  canRemove
}: {
  label: string;
  modelChoiceSet: string[];
  modelValue: string;
  selectedAttributes: QueryColumn[];
  onSelectModel: (modelName: string) => void;
  onSelectAttributes: (modelName: string, attributes: QueryColumn[]) => void;
  removeModel: () => void;
  canRemove: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [modelAttributes, setModelAttributes] = useState([] as Attribute[]);
  const [selectableModelAttributes, setSelectableModelAttributes] = useState(
    [] as Attribute[]
  );
  // All the slices related to a given model / attribute,
  //   with the model / attribute as a "label".
  // Matrices will have modelName + attributeName.
  const [updateCounter, setUpdateCounter] = useState(0);

  const {removeSlice} = useContext(QueryContext);
  const classes = useStyles();

  let reduxState = useReduxState();

  const handleModelSelect = useCallback(
    (modelName: string) => {
      onSelectModel(modelName);
      if ('' !== modelName) {
        let template = selectTemplate(reduxState, modelName);
        setModelAttributes(
          visibleSortedAttributesWithUpdatedAt(template.attributes)
        );
      }
    },
    [reduxState, onSelectModel]
  );

  function handleRemoveSlice(modelName: string, index: number) {
    removeSlice(modelName, index);
    setUpdateCounter(updateCounter + 1);
  }

  const showAttributes = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    setSelectableModelAttributes(selectAllowedModelAttributes(modelAttributes));
  }, [modelAttributes]);

  const {
    matrixModelNames,
    collectionModelNames,
    matrixSlices,
    collectionSlices
  } = useSliceMethods(modelValue, updateCounter, setUpdateCounter, removeSlice);

  const hasMatrixSlices = matrixModelNames.includes(modelValue);
  const hasCollectionSlices = collectionModelNames.includes(modelValue);
  console.log('sliceable things', matrixModelNames, collectionModelNames);
  const hasSlices = hasMatrixSlices || hasCollectionSlices;

  const id = `${label}-${Math.random()}`;

  return (
    <Grid container alignItems='center' justify='flex-start'>
      <Grid item xs={2}>
        <FormControl className={classes.formControl}>
          <InputLabel shrink id={id}>
            {label}
          </InputLabel>
          <Select
            labelId={id}
            value={modelValue}
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
      {modelValue ? (
        <React.Fragment>
          <Grid item xs={9} container spacing={2} direction='column'>
            <Grid item>
              <Button
                onClick={showAttributes}
                variant='contained'
                color='default'
              >
                {`Attributes - ${
                  selectedAttributes
                    ? selectedAttributes.map((a) => a.attribute_name).join(', ')
                    : 'None'
                }`}
              </Button>
              <QueryAttributesModal
                attributes={selectedAttributes || []}
                attributeOptions={selectableModelAttributes}
                setAttributes={(attributes: QueryColumn[]) =>
                  onSelectAttributes(modelValue, attributes)
                }
                model_name={modelValue || ''}
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
              />
            </Grid>
            {hasSlices ? (
              <Grid item>
                <QuerySlicePane
                  modelName={modelValue}
                  isMatrix={hasMatrixSlices}
                  slices={hasMatrixSlices ? matrixSlices : collectionSlices}
                  handleRemoveSlice={handleRemoveSlice}
                />
              </Grid>
            ) : null}
          </Grid>
        </React.Fragment>
      ) : null}
      <Grid item xs={1}>
        <RemoveModelIcon canRemove={canRemove} removeModel={removeModel} />
      </Grid>
    </Grid>
  );
};

export default QueryModelAttributeSelector;
