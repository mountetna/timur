// Generic filter component?
// Model, attribute, operator, operand

import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import {QueryContext} from '../../contexts/query/query_context';
import {selectQuerySelectedModels} from '../../selectors/query_selector';

const useStyles = makeStyles((theme) => ({
  previewPane: {
    overflowX: 'auto',
    maxWidth: '100%',
    maxHeight: '100%'
  }
}));

const QueryFilter = ({
  index,
  modelName,
  attributeName,
  operator,
  operand,
  setFilter,
  removeFilter
}: any) => {
  const classes = useStyles();
  const {state} = useContext(QueryContext);

  let modelNames = selectQuerySelectedModels(state);

  function setModelName() {}

  return (
    <Grid container>
      <Grid item>
        <InputLabel id={`modelSelect-${index}`}>Model</InputLabel>
        <Select
          labelId={`modelSelect-${index}`}
          value={modelName}
          onChange={setModelName}
          displayEmpty
        >
          {modelNames.map((name) => (
            <MenuItem value={name}>{name}</MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item></Grid>
      <Grid item></Grid>
      <Grid item></Grid>
    </Grid>
  );
};

export default QueryFilter;
