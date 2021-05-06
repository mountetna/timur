import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {useModal} from 'etna-js/components/ModalDialogContainer';
import {selectTemplate} from 'etna-js/selectors/magma';

import {visibleSortedAttributes} from '../../utils/attributes';

function AttributeSelector({attribute, checked, onClick}) {
  return (
    <div className='map_attribute report_row' key={attribute.attribute_name}>
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
      <div className='description-wrapper'>
        {attribute.description && (
          <span className='description'>{attribute.description}</span>
        )}
      </div>
    </div>
  );
}

export default function QueryAttributesModal({
  model_name,
  attributes,
  setAttributes
}) {
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  let template = useReduxState((state) => selectTemplate(state, model_name));
  const attributeOptions = visibleSortedAttributes(template.attributes).filter(
    (attribute) => 'project' !== attribute.model_name
  );

  const {dismissModal} = useModal();

  useEffect(() => {
    setSelectedAttributes(attributes.filter(({model}) => model === model_name));
  }, []);

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
    dismissModal();
  }

  return (
    <div className='query-attributes-modal'>
      <div className='model_report'>
        <div className='heading report_row'>
          <span className='name'>Model</span>
          <span className='title'>{model_name}</span>
        </div>
        <div className='heading report_row all-selector' onClick={toggleAll}>
          <span className='name'>All</span>
        </div>
        {attributeOptions.map((attribute) => (
          <AttributeSelector
            key={attribute.attribute_name}
            onClick={toggleAttribute}
            attribute={attribute}
            checked={attributeCurrentlySelected(attribute)}
          />
        ))}
      </div>
      <div className='actions'>
        <Button variant='contained' color='primary' onClick={handleOk}>
          Ok
        </Button>
      </div>
    </div>
  );
}
