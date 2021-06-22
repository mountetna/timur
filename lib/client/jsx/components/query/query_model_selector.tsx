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

import {visibleSortedAttributesWithUpdatedAt} from '../../utils/attributes';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(0)
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

const QueryModelSelector = ({
  label,
  modelChoiceSet,
  modelValue,
  onSelectModel,
  removeModel,
  canRemove
}: {
  label: string;
  modelChoiceSet: string[];
  modelValue: string;
  onSelectModel: (modelName: string) => void;
  removeModel: () => void;
  canRemove: boolean;
}) => {
  const [open, setOpen] = useState(false);
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
      }
    },
    [reduxState]
  );

  function handleRemoveSlice(modelName: string, index: number) {
    removeSlice(modelName, index);
    setUpdateCounter(updateCounter + 1);
  }

  const id = `${label}-${Math.random()}`;

  return (
    <Grid
      container
      className={classes.container}
      alignItems='center'
      justify='flex-start'
    >
      <Grid item xs={2}>
        <FormControl className={classes.formControl}>
          <InputLabel id={id}>
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
      <Grid item xs={1}>
        <RemoveModelIcon canRemove={canRemove} removeModel={removeModel} />
      </Grid>
    </Grid>
  );
};

export default QueryModelSelector;
