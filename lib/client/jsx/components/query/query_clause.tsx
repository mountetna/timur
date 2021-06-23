import React, { PropsWithChildren, useCallback, useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {QueryContext} from '../../contexts/query/query_context';
import QueryModelSelector from './query_model_selector';

const useStyles = makeStyles((theme) => ({
  clauseTitle: {
    fontSize: "1.2rem"
  },
  queryClause: {
    padding: "15px",
    borderBottom: "1px solid #eee"
  }
}));

const QueryClause = ({title, children} : PropsWithChildren<{ title: string }>) => {
  const classes = useStyles();

  return (
    <Grid alignItems='flex-start' container className={classes.queryClause}>
      <Grid xs={1} item className={classes.clauseTitle}>{title}</Grid>
      <Grid xs={11} item>
        { children }
      </Grid>
    </Grid>
  );
};

export default QueryClause;
