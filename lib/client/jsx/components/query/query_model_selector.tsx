import React, {useCallback} from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from '@material-ui/core/styles';

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
  const classes = useStyles();

  const handleModelSelect = useCallback(
    (modelName: string) => {
      onSelectModel(modelName);
    },
    [onSelectModel]
  );

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
      <Grid item xs={1}>
        <RemoveModelIcon canRemove={canRemove} removeModel={removeModel} />
      </Grid>
    </Grid>
  );
};

export default QueryModelSelector;
