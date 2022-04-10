import { connect } from 'react-redux';
import React, { useState, useCallback } from 'react';
import { sortAttributes } from '../../utils/attributes';
import {useReduxState} from 'etna-js/hooks/useReduxState';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MapHeading from './map_heading';

const attributeStyles = makeStyles((theme) => ({
  value: {
    color: 'darkgoldenrod',
    cursor: 'pointer'
  },
  type: {
    color: 'gray',
    width: '25%',
    paddingRight: '10px'
  }
}));

const ModelAttribute = ({ attribute: { attribute_name, attribute_type, description }, setAttribute }) => {
  const classes = attributeStyles();

  return <TableRow>
    <TableCell className={classes.type} align="right">{attribute_type}</TableCell>
    <TableCell className={classes.value} align="left" onClick={ () => setAttribute(attribute_name) }>{attribute_name} </TableCell>
    <TableCell align="left">{description}</TableCell>
  </TableRow>
}

const reportStyles = makeStyles((theme) => ({
  model_report: {
    flex: '1 1 50%',
    overflowY: 'scroll',
    padding: '15px 10px'
  },
  heading: {
    marginBottom: '10px'
  },
  report_row: {
    borderBottom: '1px solid #eee'
  },
  table: {
    boxSizing: 'border-box',
    height: 'calc(100% - 95px)',
    overflowY: 'scroll'
  },
  filter: {
    paddingBottom: '10px',
  },
  name: {
    color: 'gray'
  },
  title: {
    color: 'forestgreen'
  },
  type: {
    width: '25%',
    paddingRight: '10px'
  }
}));

const ModelReport = ({ model_name, template, setAttribute }) => {
  if (!template) return null;

  const classes = reportStyles();

  const [ filterString, setFilterString ] = useState('');

  const matchesFilter = useCallback(attribute => {
    if (filterString == '') return true;

    const { name, attribute_type, description } = attribute;

    if (filterString.split(/\s/).filter(_=>_).map(t => new RegExp(t,'i')).every(
      token => (
        name?.match(token) ||
        attribute_type?.match(token) ||
        description?.match(token)
      )
    )) return true;

    return false;
  }, [ filterString ])

  return <Grid className={ classes.model_report }>
    <MapHeading className={ classes.heading } name='Model' title={model_name}/>
    <TextField
      fullWidth
      placeholder='Filter attributes'
      variant='outlined'
      size='small'
      className={classes.filter}
      value={ filterString }
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        )
      }}
      onChange={(e) => setFilterString(e.target.value)}
    />
    <TableContainer component={Paper} className={classes.table}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.type} align="right">Type</TableCell>
            <TableCell align="left">Attribute</TableCell>
            <TableCell align="left">Description</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
        {
          Object.values(sortAttributes(template.attributes)).filter(
            attribute => !attribute.hidden && matchesFilter(attribute)
          ).map(attribute => <ModelAttribute key={attribute.attribute_name} setAttribute={ setAttribute } attribute={attribute} />)
        }
        </TableBody>
      </Table>
    </TableContainer>
  </Grid>;
}

export default ModelReport;
