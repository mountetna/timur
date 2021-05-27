import React, {useCallback, useContext, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import {useReduxState} from 'etna-js/hooks/useReduxState';

import {QueryContext} from '../../contexts/query/query_context';

const QueryWherePane = () => {
  const {state, addRecordFilter, removeRecordFilter} = useContext(QueryContext);

  if (!state.rootModel) return null;

  let reduxState = useReduxState();

  return (
    <Card>
      <CardHeader title='Where' subheader='filter the records' />
      <CardContent></CardContent>
      <CardActions disableSpacing></CardActions>
    </Card>
  );
};

export default QueryWherePane;
