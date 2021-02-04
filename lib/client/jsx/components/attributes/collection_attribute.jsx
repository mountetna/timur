import MagmaLink from '../magma_link';
import {connect} from 'react-redux';

import {reviseDocument} from 'etna-js/actions/magma_actions';
import React, {Component, useMemo} from 'react';
import ListInput from 'etna-js/components/inputs/list_input';
import SlowTextInput from 'etna-js/components/inputs/slow_text_input';

const CollectionAttribute = ({
  mode,
  value,
  revised_value,
  document,
  template,
  attribute,
  reviseDocument
}) => {
  if (mode != 'edit') {
    var collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sortedCollection = useMemo(
      () => [...(value || [])].sort(collator.compare),
      [value]
    );
    return (
      <div className='attribute'>
        <div className='collection'>
          {sortedCollection.map((link) => (
            <div key={link} className='collection_item'>
              <MagmaLink link={link} model={attribute.link_model_name} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='attribute'>
      <ListInput
        placeholder='New or existing ID'
        className='link_text'
        values={revised_value || []}
        itemInput={SlowTextInput}
        onChange={(links) =>
          reviseDocument(document, template, attribute, links)
        }
      />
    </div>
  );
};

export default connect(null, {reviseDocument})(CollectionAttribute);
