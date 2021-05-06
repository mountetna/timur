import React, {useState, useContext} from 'react';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import {QueryContext} from '../../contexts/query/query_context';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function QueryControls() {
  const {state, setFilters, setRootModel} = useContext(QueryContext);
  const classes = useStyles();

  let models = state.attributes ? Object.keys(state.attributes) : [];

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel shrink>Root Model</InputLabel>
        <Select
          value={state.rootModel}
          onChange={setRootModel}
          displayEmpty
          className={classes.selectEmpty}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          {models.map((model_name) => (
            <MenuItem value={model_name}>{model_name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
