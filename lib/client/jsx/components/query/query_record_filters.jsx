// Generic filter component?
// Model, attribute, operator, operand

import React, {useState, useEffect, useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

import {QueryContext} from '../../contexts/query/query_context';
import {selectQueryRecordFilters} from '../../selectors/query_selector';

import QueryFilter from './query_filter';

const useStyles = makeStyles((theme) => ({
  previewPane: {
    overflowX: 'auto',
    maxWidth: '100%',
    maxHeight: '100%'
  }
}));

export default function QueryRecordFilters() {
  const classes = useStyles();
  const {state, setRecordFilters} = useContext(QueryContext);
  const recordFilters = selectQueryRecordFilters(state);

  return (
    <Grid container>
      {recordFilters.map(
        ({modelName, attributeName, operand, operator}, index) => {
          return (
            <Grid item>
              <QueryFilter
                modelName={modelName}
                attributeName={attributeName}
                operator={operator}
                operand={operand}
                index={index}
              />
            </Grid>
          );
        }
      )}
      <Grid item>
        <InputLabel id={`modelSelect-${index}`}>Model</InputLabel>
        <Select
          labelId={`modelSelect-${index}`}
          value={modelName}
          onChange={setModelName}
          displayEmpty
          className={classes.selectEmpty}
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
}
