import React, {useContext, useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {Attribute} from '../../models/model_types';

import {QueryContext} from '../../contexts/query/query_context';
import QueryAttributesModal from './query_attributes_modal';

import {visibleSortedAttributes} from '../../utils/attributes';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  container: {
    width: '100%'
  }
}));

const QueryControls = () => {
  const [open, setOpen] = useState(false);
  const [modelAttributes, setModelAttributes] = useState([] as Attribute[]);
  const [selectableModelAttributes, setSelectableModelAttributes] = useState(
    [] as Attribute[]
  );
  const {state, setRootModel, setAttributes} = useContext(QueryContext);
  const classes = useStyles();

  let reduxState = useReduxState();

  function onModelSelect(modelName: string) {
    let template = selectTemplate(reduxState, modelName);
    setRootModel(modelName, {
      model_name: modelName,
      attribute_name: template.identifier,
      display_label: `${modelName}.${template.identifier}`
    });

    setModelAttributes(visibleSortedAttributes(template.attributes));
  }

  function showAttributes() {
    setOpen(true);
  }

  useEffect(() => {
    // I think we should force people to get these FK values
    //   from the other model.
    const unallowedAttributeTypes = [
      'identifier',
      'parent',
      'child',
      'collection',
      'link'
    ];
    setSelectableModelAttributes(
      modelAttributes.filter(
        (attr: Attribute) =>
          !unallowedAttributeTypes.includes(attr.attribute_type)
      )
    );
  }, [modelAttributes]);

  return (
    <Grid
      container
      xs={12}
      className={classes.container}
      justify='center'
      alignItems='center'
    >
      <Grid container item xs={7} alignItems='center'>
        <Grid item justify='flex-start'>
          <FormControl className={classes.formControl}>
            <InputLabel shrink id='rootModel'>
              Root Model
            </InputLabel>
            <Select
              labelId='rootModel'
              value={state.rootModel}
              onChange={(e) => onModelSelect(e.target.value as string)}
              displayEmpty
              className={classes.selectEmpty}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {state.graph &&
                [...state.graph.allowedModels]
                  .sort()
                  .map((model_name: string) => (
                    <MenuItem value={model_name}>{model_name}</MenuItem>
                  ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item justify='flex-end'>
          <Button onClick={showAttributes} variant='contained' color='default'>
            Attributes
          </Button>
          <QueryAttributesModal
            attributes={
              state.rootModel && state.attributes
                ? state.attributes[state.rootModel]
                : []
            }
            attributeOptions={selectableModelAttributes}
            setAttributes={setAttributes}
            model_name={state.rootModel || ''}
            open={open}
            onClose={() => {
              setOpen(false);
            }}
          />
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <Grid container alignItems='center' justify='flex-end'>
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
};

export default QueryControls;
