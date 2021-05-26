import React, {useCallback, useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from '@material-ui/core/styles';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {Attribute} from '../../models/model_types';

import {QueryContext} from '../../contexts/query/query_context';
import {QueryColumn} from '../../contexts/query/query_types';
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
  root: {
    minWidth: 345
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
}));

const QueryModelAttributeSelector = ({
  label,
  modelChoiceSet,
  modelValue,
  selectedAttributes,
  onSelectModel,
  onSelectAttributes,
  removeModel,
  canRemove
}: {
  label: string;
  modelChoiceSet: string[];
  modelValue: string;
  selectedAttributes: QueryColumn[];
  onSelectModel: (modelName: string) => void;
  onSelectAttributes: (modelName: string, attributes: QueryColumn[]) => void;
  removeModel: () => void;
  canRemove: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [modelAttributes, setModelAttributes] = useState([] as Attribute[]);
  const [selectableModelAttributes, setSelectableModelAttributes] = useState(
    [] as Attribute[]
  );
  const classes = useStyles();

  let reduxState = useReduxState();

  const onModelSelect = useCallback(
    (modelName: string) => {
      onSelectModel(modelName);
      if ('' !== modelName) {
        let template = selectTemplate(reduxState, modelName);
        setModelAttributes(visibleSortedAttributes(template.attributes));
      }
    },
    [reduxState]
  );

  const showAttributes = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    // I think we should force people to get these FK values
    //   from the other model, because generally people won't want
    //   the FK itself, just the identifier of the other model.
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

  const id = `${label}-${Math.random()}`;

  return (
    <Grid container alignItems='center'>
      <Grid item justify='flex-start'>
        <FormControl className={classes.formControl}>
          <InputLabel shrink id={id}>
            {label}
          </InputLabel>
          <Select
            labelId={id}
            value={modelValue}
            onChange={(e) => onModelSelect(e.target.value as string)}
            displayEmpty
            className={classes.selectEmpty}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {modelChoiceSet.sort().map((model_name: string) => (
              <MenuItem value={model_name}>{model_name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {modelValue ? (
        <Grid item justify='flex-end'>
          <Button onClick={showAttributes} variant='contained' color='default'>
            {`Attributes - ${
              selectedAttributes ? selectedAttributes.length : 0
            }`}
          </Button>
          {canRemove ? (
            <Tooltip
              title='Remove model and attributes'
              aria-label='remove model and attributes'
            >
              <IconButton
                aria-label='remove model and attributes'
                onClick={removeModel}
              >
                <ClearIcon color='action' />
              </IconButton>
            </Tooltip>
          ) : null}
          <QueryAttributesModal
            attributes={selectedAttributes}
            attributeOptions={selectableModelAttributes}
            setAttributes={(attributes: QueryColumn[]) =>
              onSelectAttributes(modelValue, attributes)
            }
            model_name={modelValue || ''}
            open={open}
            onClose={() => {
              setOpen(false);
            }}
          />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default QueryModelAttributeSelector;
