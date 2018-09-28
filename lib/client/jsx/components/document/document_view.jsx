// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import { capitalize } from '../../utils/format';
import DocumentTitle from './document_title';
import DocumentDetails from './document_details';

export default class DocumentView extends React.Component{
  getButtons() {
    let { editing } = this.props;

    let buttons = (editing ?
      [ 'run', 'save', 'cancel' ]
      :
      [ 'run', 'copy', 'remove', 'edit' ]
    ).map(
      button_name => {
        let callback = this.props['on'+capitalize(button_name)];

        if (!callback) return null;

        return {
          type: button_name,
          click: callback
        };
      }
    ).filter(button => button);

    return buttons;
  }

  render(){
    let { document, onUpdate, editing, children } = this.props;
    let buttons = this.getButtons();

    if (!document) return null;

    return(
      <div className='document-view'>
        <div className='document-view-header'>
          <DocumentTitle
            name={document.name}
            editing={editing}
            onChange={onUpdate('name')}
            buttons={buttons} />
          <DocumentDetails
            document={ document }
            onUpdate={ onUpdate }
            editing={ editing } />
        </div>
        {
          children
        }
      </div>
    );
  }
}
