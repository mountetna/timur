import React, {useCallback} from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120
  }
}));

const QueryModelSelector = ({
  label,
  modelChoiceSet,
  modelValue,
  onSelectModel
}: {
  label: string;
  modelChoiceSet: string[];
  modelValue: string;
  onSelectModel: (modelName: string) => void;
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
    <FormControl className={classes.formControl}>
      <InputLabel shrink id={id}>
        {label}
      </InputLabel>
      <Select
        labelId={id}
        value={modelValue}
        onChange={(e) => handleModelSelect(e.target.value as string)}
      >
        {modelChoiceSet.sort().map((modelName: string, index: number) => (
          <MenuItem key={index} value={modelName}>
            {modelName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default QueryModelSelector;
