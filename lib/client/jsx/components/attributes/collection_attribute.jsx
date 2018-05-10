// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as MagmaActions from '../../actions/magma_actions';
import MagmaLink from '../magma_link';
import ListInput from '../inputs/list_input';
import SlowTextInput from '../inputs/slow_text_input';

export default class CollectionAttribute extends React.Component{
  renderLinks(){
    let {value, attribute} = this.props;
    let links = value || [];

    return(
      <div className='collection'>
        {links.map((link)=>{
            return(
              <div key={link} className='collection_item'>
                
                <MagmaLink link={link} model={attribute.model_name} />
              </div>
            );
          }
        )}
      </div>
    );
  }

  render(){
    let {
      revision,
      mode,
      document,
      template,
      attribute,
      reviseDocument
    } = this.props;

    let input_props = {
      placeholder: 'New or existing ID',
      className: 'link_text',
      values: revision || [],
      itemInput: SlowTextInput,
      onChange: (new_links)=>{
        reviseDocument({
          document,
          template,
          attribute,
          revised_value: new_links
        });
      }
    };

    return(
      <div className='value'>

        {mode == 'edit' ? <ListInput {...input_props} /> : this.renderLinks()}
      </div>
    );
  }
}

const mapStateToProps = (dispatch, own_props)=>{
  return {};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    reviseDocument: (args)=>{
      dispatch(MagmaActions.reviseDocument(args));
    }
  };
};

export const CollectionAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionAttribute);
