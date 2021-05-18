// Generic filter component?
// Model, attribute, operator, operand

import React, {useState, useEffect, useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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

const QueryRecordFilters = () => {
  const classes = useStyles();
  const {state, addRecordFilter, removeRecordFilter} = useContext(QueryContext);
  const recordFilters = selectQueryRecordFilters(state);

  return (
    <Grid container>
      {recordFilters &&
        recordFilters.map(
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
      <Grid item></Grid>
    </Grid>
  );
};

export default QueryRecordFilters;
