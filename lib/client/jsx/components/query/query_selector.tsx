import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '80%',
    minWidth: 120
  }
}));

function id(label: string) {
  return `${label}-${Math.random()}`;
}

const Selector = React.memo(
  ({
    canEdit,
    onSelect,
    label,
    name,
    choiceSet
  }: {
    canEdit: boolean;
    onSelect: (name: string) => void;
    label: string;
    name: string;
    choiceSet: string[];
  }) => {
    const classes = useStyles();

    if (!canEdit) return <Typography>{name}</Typography>;

    return (
      <FormControl className={classes.fullWidth}>
        <Select
          labelId={id(label)}
          value={name}
          onChange={(e) => onSelect(e.target.value as string)}
        >
          {choiceSet.sort().map((option: string, index: number) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

export default Selector;
