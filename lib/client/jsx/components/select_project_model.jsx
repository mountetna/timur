import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {requestAnswer} from 'etna-js/actions/magma_actions';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectUserPermissions} from 'etna-js/selectors/user-selector';

const useStyles = makeStyles((theme) => ({
  select: {
    flex: '1 1 auto'
  },
  select_input: {
    paddingRight: '5px'
  }
}));

const SelectProjectModelDialog = ({open, onClose, update, title, buttonLabel, description}) => {
  const projects = useReduxState(state => {
    let permissions = selectUserPermissions(state);
    return Object.values(permissions).map(({project_name}) => project_name);
  });

  const dispatch = useDispatch();

  const [ project_name, setProjectName ] = useState(null);
  const [ models, setModels ] = useState(null);
  const [ model_name, setModelName ] = useState('');
  const [ error, setError ] = useState(null);

  const loadProject = useCallback(() => {
    requestAnswer({
      project_name,
      query: '::model_names'
    })(dispatch).then(
      ({answer}) => { setModels(answer); setError(null); }
    ).catch( e => e.then( ({error}) => setError(error) ) );
  }, [ project_name ]);


  const classes = useStyles();

  return <Dialog open={open} onClose={onClose}>
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {description}
      </DialogContentText>
      <Grid container>
        <Autocomplete
          freeSolo
          className={classes.select}
          value={ project_name }
          onChange={ (e, value) => { setProjectName(value); setModels(null); setModelName(''); } }
          options={projects}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select project"
              margin="normal"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                className: classes.select_input,
                endAdornment: project_name && <InputAdornment>
                  <IconButton size='small' onClick={() => loadProject() }>
                    <CheckIcon/>
                  </IconButton>
                </InputAdornment>,
                type: 'search'
              }}
            />
          )}
        />
      </Grid>
      {
        models && <Grid container>
          <FormControl variant='outlined' size='small' className={classes.select}>
            <InputLabel>Select model</InputLabel>
            <Select
              label="Select model"
              value={model_name}
              onChange={(e) => setModelName(e.target.value)}>
              {
                models.map( m => <MenuItem key={m} value={m}>{m}</MenuItem> )
              }
            </Select>
          </FormControl>
        </Grid>
      }
      { error && <DialogContentText><Typography color='error'>{error}</Typography></DialogContentText> }
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">
        Cancel
      </Button>
      <Button disabled={ !model_name } onClick={() => { update(project_name, model_name); onClose(); } } color="primary">
        {buttonLabel}
      </Button>
    </DialogActions>
  </Dialog>
}

export default SelectProjectModelDialog;
