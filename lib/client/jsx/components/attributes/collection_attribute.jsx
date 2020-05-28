import MagmaLink from '../magma_link';
import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import React, { Component } from 'react';
import ListInput from '../inputs/list_input';
import SlowTextInput from '../inputs/slow_text_input';

const CollectionAttribute = ({ mode, value, revised_value,
  document, template, attribute, reviseDocument }) => {
  if (mode != 'edit') return (
    <div className='attribute'>
      <div className='collection'>
        {
          (value || []).map( link =>
            <div key={ link } className='collection_item'>
              <MagmaLink link={ link } model={ attribute.link_model_name }/>
            </div>
          )
        }
      </div>
    </div>
  );

  return <div className='attribute'>
    <ListInput
      placeholder='New or existing ID'
      className='link_text'
      values={ revised_value || [] }
      itemInput={ SlowTextInput }
      onChange={
        links => reviseDocument( document, template, attribute, links)
      }/>
  </div>;
}

export default connect(
  null,
  { reviseDocument }
)(CollectionAttribute);
