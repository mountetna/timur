// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import DocumentTitle from './document_title';
import DocumentDetails from './document_details';
import { buttonsWithCallbacks } from '../button_bar';

export default class DocumentView extends React.Component {
  getButtons() {
    let { editing } = this.props;

    return buttonsWithCallbacks(editing ?
      [ 'run', 'save', 'cancel' ]
      :
      [ 'run', 'remove', 'copy', 'edit' ],
      this.props
    );
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
