import { useDispatch } from 'react-redux';
import React, { useState, useCallback } from 'react';
import { sortAttributes } from '../../utils/attributes';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {requestAnswer} from 'etna-js/actions/magma_actions';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';

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
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';

const attributeStyles = makeStyles((theme) => ({
  value: {
    color: 'darkgoldenrod',
    cursor: 'pointer'
  },
  type: {
    color: 'gray',
    width: '25%',
    paddingRight: '10px'
  },
  progress: {
    width: '30px',
    margin: '5px'
  },
  count: {
    width: '20%'
  }
}));

const ModelAttribute = ({ attribute: { attribute_name, attribute_type, description }, setAttribute, count, modelCount }) => {
  const classes = attributeStyles();

  return <TableRow>
    <TableCell className={classes.type} align="right">{attribute_type}</TableCell>
    <TableCell className={classes.value} align="left" onClick={ () => setAttribute(attribute_name) }>{attribute_name} </TableCell>
    <TableCell align="left">{description}</TableCell>
    { count != undefined && <TableCell className={classes.count} align="left">
      <Grid container alignItems='center'>
        {count}
        <LinearProgress className={classes.progress} variant='determinate' value={100 * count/(modelCount || 1)}/>
        <Typography variant='body2' color='textSecondary'>{ Math.round(100 * count / (modelCount||1)) }%</Typography>
      </Grid>
      </TableCell> }
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
  },
  count: {
    width: '20%'
  }
}));

const ModelReport = ({ model_name, updateCounts, counts, template, setAttribute }) => {
  if (!template) return null;

  const dispatch = useDispatch();

  const classes = reportStyles();

  const modelCount = counts[model_name]?.count;
  const attributeCounts = counts[model_name]?.attributes;

  const getAnswer = (query, handle) => requestAnswer({ query })(dispatch).then(
    ({answer}) => handle(answer)
  );

  console.log({counts});

  const countModel = () => {
    if (modelCount != undefined) return;

    updateCounts({type: 'MODEL_COUNT', model_name, count: -1});

    getAnswer( [ model_name, '::count' ], count => updateCounts({type: 'MODEL_COUNT', model_name, count}));

    Object.keys(template.attributes).forEach( attribute_name => {
      getAnswer(
        [ model_name, [ '::has', attribute_name ], '::count' ],
        count => updateCounts({type: 'ATTRIBUTE_COUNT', model_name, attribute_name, count})
      )
    });
  };

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
    <MapHeading className={ classes.heading } name='Model' title={model_name}>
      {
        modelCount != undefined && modelCount >= 0 ? <Typography>{modelCount} {modelCount > 1 || modelCount == 0 ? 'records' : 'record'}</Typography> : 
        <Tooltip title='Count records and attributes'>
          <Button
            disabled={modelCount!=undefined}
            onClick={() => countModel(model_name)}
            size='small'
            color='secondary'>Count</Button>
        </Tooltip>
      }
    </MapHeading>
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
            { attributeCounts && <TableCell className={classes.count} align="left">Counts</TableCell> }
          </TableRow>
        </TableHead>

        <TableBody>
        {
          Object.values(sortAttributes(template.attributes)).filter(
            attribute => !attribute.hidden && matchesFilter(attribute)
          ).map( attribute => <ModelAttribute
              key={attribute.attribute_name}
              setAttribute={ setAttribute }
              count={ attributeCounts && attributeCounts[attribute.attribute_name] }
              modelCount={ modelCount }
              attribute={attribute} />
          )
        }
        </TableBody>
      </Table>
    </TableContainer>
  </Grid>;
}

export default ModelReport;
