import React, {useState, useEffect, useCallback} from 'react';

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

import {Attribute} from '../../models/model_types';
import {QueryColumn} from '../../contexts/query/query_types';

const useStyles = makeStyles((theme) => ({
  scrollable: {
    overflowY: 'auto'
  }
}));

function AttributeSelector({
  attribute,
  checked,
  onClick
}: {
  attribute: Attribute;
  checked: boolean;
  onClick: (attr: Attribute) => void;
}) {
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

const QueryAttributesModal = ({
  model_name,
  attributes,
  setAttributes,
  attributeOptions,
  onClose,
  open
}: {
  model_name: string;
  attributes: QueryColumn[];
  setAttributes: (attributes: QueryColumn[], model_name: string) => void;
  attributeOptions: Attribute[];
  onClose: () => void;
  open: boolean;
}) => {
  const classes = useStyles();
  const [selectedAttributes, setSelectedAttributes] = useState(
    [] as QueryColumn[]
  );
  const contentRef: React.RefObject<HTMLInputElement> = React.useRef(null);

  useEffect(() => {
    if (open) {
      const {current: contentElement} = contentRef;
      if (contentElement !== null) {
        contentElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    setSelectedAttributes(
      attributes.filter((attr: QueryColumn) => attr.model_name === model_name)
    );
  }, [attributes]);

  let reduxState = useReduxState();
  let template = selectTemplate(reduxState, model_name);

  const attributeCurrentlySelected = useCallback(
    (attribute: Attribute | QueryColumn) => {
      return (
        selectedAttributes.findIndex(
          (attr: QueryColumn) =>
            attr.model_name === model_name &&
            attr.attribute_name === attribute.attribute_name
        ) > -1
      );
    },
    [selectedAttributes, model_name]
  );

  const toggleAttribute = useCallback(
    (attribute: Attribute) => {
      setSelectedAttributes(
        attributeCurrentlySelected(attribute)
          ? selectedAttributes.filter(
              (attr: QueryColumn) =>
                !(
                  attr.model_name === model_name &&
                  attr.attribute_name === attribute.attribute_name
                )
            )
          : selectedAttributes.concat([
              {
                model_name,
                attribute_name: attribute.attribute_name,
                display_label: `${model_name}.${attribute.attribute_name}`,
                slices: []
              }
            ])
      );
    },
    [attributeCurrentlySelected, selectedAttributes, model_name]
  );

  const toggleAll = useCallback(() => {
    let updatedAttributes: QueryColumn[] = [];
    if (selectedAttributes.length === 0) {
      updatedAttributes = attributeOptions.map((attribute: Attribute) => {
        return {
          model_name: model_name,
          attribute_name: attribute.attribute_name,
          display_label: `${model_name}.${attribute.attribute_name}`,
          slices: []
        };
      });
    }
    setSelectedAttributes(updatedAttributes);
  }, [selectedAttributes, model_name, attributeOptions]);

  const handleOk = useCallback(() => {
    setAttributes(selectedAttributes, model_name);
    onClose();
  }, [selectedAttributes, model_name, onClose, setAttributes]);

  if (!template) return null;

  return (
    <Dialog onClose={onClose} maxWidth='md' open={open} scroll='paper'>
      <DialogTitle id='query-attributes-dialog-title'>
        <span className='name'>Model</span>{' '}
        <span className='title'>{model_name}</span>
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText
          id='query-attributes-dialog-description'
          ref={contentRef}
          tabIndex={-1}
        >
          {attributeOptions.map((attribute: Attribute) => (
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
        <Grid container justify='flex-start'>
          <Grid item xs={6}>
            <Button onClick={toggleAll} color='default'>
              All
            </Button>
          </Grid>
          <Grid item xs={6} container justify='flex-end'>
            <Grid item>
              <Button onClick={onClose} color='secondary'>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={handleOk} color='primary'>
                Ok
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default QueryAttributesModal;
