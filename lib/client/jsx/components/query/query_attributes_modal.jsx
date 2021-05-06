import React, {useState, useEffect, useRef} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {makeStyles} from '@material-ui/core/styles';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {visibleSortedAttributes} from '../../utils/attributes';

const useStyles = makeStyles((theme) => ({
  scrollable: {
    overflowY: 'auto'
  }
}));

function AttributeSelector({attribute, checked, onClick}) {
  const classes = useStyles();

  return (
    <Grid container className='attribute-row' key={attribute.attribute_name}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={() => onClick(attribute)}
            name={attribute.attribute_name}
          />
        }
        label={attribute.attribute_name}
      />
      <Grid item className='description-wrapper'>
        {attribute.description && (
          <span className='description'>{attribute.description}</span>
        )}
      </Grid>
    </Grid>
  );
}

export default function QueryAttributesModal({
  model_name,
  attributes,
  setAttributes,
  onClose,
  open
}) {
  const classes = useStyles();
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const contentRef = React.useRef(null);

  useEffect(() => {
    if (open) {
      const {current: contentElement} = contentRef;
      if (contentElement !== null) {
        contentElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    setSelectedAttributes(attributes.filter(({model}) => model === model_name));
  }, []);

  let template = useReduxState((state) => selectTemplate(state, model_name));

  if (!template) return null;

  const attributeOptions = visibleSortedAttributes(template.attributes).filter(
    (attribute) => 'project' !== attribute.model_name
  );

  function attributeCurrentlySelected(attribute) {
    return (
      selectedAttributes.findIndex(
        ({model, attribute_name}) =>
          model === model_name && attribute_name === attribute.attribute_name
      ) > -1
    );
  }

  function toggleAttribute(attribute) {
    setSelectedAttributes(
      attributeCurrentlySelected(attribute)
        ? selectedAttributes.filter(
            ({attribute_name, model}) =>
              !(
                model === model_name &&
                attribute_name === attribute.attribute_name
              )
          )
        : selectedAttributes.concat({
            model: model_name,
            attribute_name: attribute.attribute_name,
            display_label: `${model_name}.${attribute.attribute_name}`
          })
    );
  }

  function toggleAll() {
    let updatedAttributes = [];
    if (selectedAttributes.length === 0) {
      updatedAttributes = attributeOptions.map((attribute) => {
        return {
          model: model_name,
          attribute_name: attribute.attribute_name,
          display_label: `${model_name}.${attribute.attribute_name}`
        };
      });
    }
    setSelectedAttributes(updatedAttributes);
  }

  function handleOk() {
    setAttributes(selectedAttributes, model_name);
    onClose();
  }

  return (
    <Dialog onClose={onClose} maxWidth='md' open={open} scroll='paper'>
      <DialogTitle id='query-attributes-dialog-title'>
        <span className='name'>Model</span>
        <span className='title'>{model_name}</span>
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText
          id='query-attributes-dialog-description'
          ref={contentRef}
          tabIndex={-1}
        >
          {attributeOptions.map((attribute) => (
            <AttributeSelector
              key={attribute.attribute_name}
              onClick={toggleAttribute}
              attribute={attribute}
              checked={attributeCurrentlySelected(attribute)}
            />
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button contained onClick={toggleAll} color='primary'>
          All
        </Button>
        <Button contained onClick={handleOk} color='primary'>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
