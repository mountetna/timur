import { reviseDocument } from '../../actions/magma_actions';
import { Component } from 'react';
import ListInput from '../inputs/list_input';

class CollectionAttribute extends Component {
  update(new_links) {
    let { reviseDocument, document, template, attribute } = this.props;

    reviseDocument( document, template, attribute, new_links );
  }

  renderLinks() {
    let { value, attribute } = this.props;
    let links = value || [];

    return <div className="collection">
      {
        links.map( link => 
          <div key={ link } className="collection_item">
            <MagmaLink link={ link } model={ attribute.model_name }/>
          </div>
        )
      }
    </div>;
  }

  render() {
    let { revision, mode, reviseDocument } = this.props;

    return <div className="value">
      {
        mode == "edit"
          ?  <ListInput
            values={ revision || [] } 
            placeholder='New or existing ID'
            onChange={ this.update.bind(this) } />
          : this.renderLinks()
      }
    </div>;
  }
}

export default connect(
  null,
  { reviseDocument }
)(CollectionAttribute);
