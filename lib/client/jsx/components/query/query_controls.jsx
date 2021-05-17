import React, {useState, useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
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
    <Grid container justify='center' alignItems='center'>
      <Grid item xs={7}>
        <FormControl className={classes.formControl}>
          <InputLabel shrink id='rootModel'>
            Root Model
          </InputLabel>
          <Select
            labelId='rootModel'
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
      </Grid>
      <Grid item xs={5}>
        <Grid container alignItems='center' justify='center'>
          <Grid item>
            <ButtonGroup
              variant='contained'
              color='primary'
              aria-label='contained primary button group'
            >
              <Button>Query</Button>
              <Button>{'\u21af TSV'}</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
