import { useDispatch } from 'react-redux';
import React, { useState, useCallback } from 'react';
import { sortAttributes } from '../../utils/attributes';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {requestAnswer} from 'etna-js/actions/magma_actions';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {selectUserPermissions} from 'etna-js/selectors/user-selector';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import {makeStyles} from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MapHeading from './map_heading';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';

const attributeStyles = makeStyles((theme) => ({
  attribute: {
    wordBreak: 'break-all'
  },
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
  counts: {
    width: '20%'
  }
}));

const ModelAttribute = ({ attribute: { attribute_name, attribute_type, attribute_group, description }, setAttribute, count, modelCount }) => {
  const classes = attributeStyles();

  return <TableRow className={classes.attribute}>
    <TableCell className={classes.type} align="right">{attribute_type}</TableCell>
    <TableCell className={classes.value} align="left" onClick={ () => setAttribute(attribute_name) }>{attribute_name} </TableCell>
    <TableCell align="left">{attribute_group}</TableCell>
    <TableCell align="left">{description}</TableCell>
    {
      count != undefined && <TableCell className={classes.count} align="left">
        <Grid container alignItems='center'>
          {count}
          <LinearProgress className={classes.progress} variant='determinate' value={100 * count/(modelCount || 1)}/>
          <Typography variant='body2' color='textSecondary'>{ Math.round(100 * count / (modelCount||1)) }%</Typography>
        </Grid>
      </TableCell>
    }
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

const ATT_KEYS = {
  attribute: 'attribute_name',
  type: 'attribute_type',
  group: 'attribute_group',
  description: 'description'
};

const ModelReport = ({ model_name, updateCounts, counts, template, setAttribute }) => {
  if (!template) return null;

  const dispatch = useDispatch();

  const classes = reportStyles();

  const modelCount = counts[model_name]?.count;
  const attributeCounts = counts[model_name]?.attributes;

  const getAnswer = (query, handle) => requestAnswer({ query })(dispatch).then(
    ({answer}) => handle(answer)
  );

  const countModel = () => {
    if (modelCount != undefined) return;

    updateCounts({type: 'MODEL_COUNT', model_name, count: -1});

    getAnswer([ model_name, '::count' ], count => updateCounts({type: 'MODEL_COUNT', model_name, count}));

    Object.keys(template.attributes).forEach( attribute_name => {
      let query;
      switch(template.attributes[attribute_name].attribute_type) {
        case 'collection':
        case 'table':
          query = [ model_name, [ attribute_name, [ '::has', '::identifier' ], '::any' ], '::count' ]
          break;
        default:
          query = [ model_name, [ '::has', attribute_name ], '::count' ];
      };

      getAnswer(
        query, 
        count => updateCounts({type: 'ATTRIBUTE_COUNT', model_name, attribute_name, count})
      )
    });
  };

  const [ filterString, setFilterString ] = useState('');

  const filterMatch = new RegExp(`^(?:(${ Object.keys(ATT_KEYS).join('|') }):)?(.*)$`)

  const matchesFilter = useCallback(attribute => {
    if (filterString == '') return true;

    let tokens = filterString.split(/\s/).filter(_=>_).map(
      token => token.match(filterMatch).slice(1)
    );

    return tokens.every( ([ column, token ]) => {
      const tokenMatch = new RegExp(token,'i');
      const values = (
        column
          ? [ attribute[ATT_KEYS[column]] ]
          : Object.values(ATT_KEYS).map(
            k => attribute[k]
          )
      );

      return values.some( s => s?.match(tokenMatch));
    });
  }, [ filterString ])

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('type');

  const sortByOrder = attributes => {
    let srt;
    if (orderBy === 'type') srt = Object.values(sortAttributes(attributes));
    else {

      srt = Object.values(attributes).sort(
        (a,b) => (a[ATT_KEYS[orderBy]]||'').localeCompare(b[ATT_KEYS[orderBy]]||'')
      )
    };
    return (order === 'desc') ? srt.reverse() : srt;
  }

  const [ showDiff, setShowDiff ] = useState(false);
  const [ diffProject, setDiffProject ] = useState(null);

  const [anchor, setAnchor] = useState(null);

  const projects = useReduxState(state => {
    let permissions = selectUserPermissions(state);
    return Object.values(permissions).map(({project_name}) => project_name);
  });

  return <Grid className={ classes.model_report }>
    <MapHeading className={ classes.heading } name='Model' title={model_name}>
      {
        modelCount != undefined && modelCount >= 0 && <Typography>{modelCount} {modelCount > 1 || modelCount == 0 ? 'records' : 'record'}</Typography>
      }
      <IconButton size='small' onClick={ e => setAnchor(e.target) }>
        <MoreVertIcon/>
      </IconButton>
      <Dialog open={showDiff} onClose={() => setShowDiff(false)}>
        <DialogTitle id="form-dialog-title">Compare Models</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a comparison project and model.
          </DialogContentText>
	  <Autocomplete
	    freeSolo
	    options={projects}
	    renderInput={(params) => (
	      <TextField
		{...params}
		label="Select project"
		margin="normal"
		variant="outlined"
		value={ diffProject }
		onChange={ e => setDiffProject(e.target.value) }
    		endAdornment={
		  <InputAdornment position="end">
		    <IconButton onClick={() => loadDiffProject() }>
		      <ArrowForward/>
		    </IconButton>
		  </InputAdornment>
		}
		InputProps={{ ...params.InputProps, type: 'search' }}
	      />
	    )}
	  />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDiff(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => setShowDiff(false)} color="primary">
            Compare
          </Button>
        </DialogActions>
      </Dialog>
      <Menu
        style={{ marginTop: '40px' }}
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)} >
        <MenuItem onClick={ () => {
          setShowDiff(true);
          setAnchor(null); } }>
          Compare with another model
        </MenuItem>
        <MenuItem
          disabled={modelCount != undefined}
          onClick={ () => { countModel(model_name); setAnchor(null); } } >
          Count records and attributes
        </MenuItem>
      </Menu>
    </MapHeading>
    <TextField
      fullWidth
      placeholder='Filter attributes, e.g. "rna type:file"'
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
            {
              [ 'type', 'attribute', 'group', 'description', 'counts' ].map( key =>
                (key !== 'counts' || attributeCounts) && 
                <TableCell key={key} className={ key in classes ? classes[key] : null } align={ key == 'type' ? 'right' : 'left' }>
                  <TableSortLabel
                    active={orderBy === key}
                    direction={orderBy === key ? order : 'asc'}
                  onClick={ (key => e => {
                      setOrder( orderBy === key && order === 'asc' ? 'desc' : 'asc' )
                      setOrderBy(key);
                    })(key) } >
                  {key}
                  </TableSortLabel>
                </TableCell>
              )
            }
          </TableRow>
        </TableHead>

        <TableBody>
        {
          sortByOrder(template.attributes).filter(
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
