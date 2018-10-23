
// Framework libraries.
import * as React from 'react';

import DocumentView from './document_view';
import ListMenu from '../list_menu';

const accessFilter = (access, documents)=>{
  return documents.filter(m => m.access == access).sort((a,b) => a > b);
};

export default class DocumentWindow extends React.Component{
  render() {
    let {
      documentType, document, documents, editing, children,
      onCreate, onSelect, onEdit, onCancel,
      onRun, onSave, onCopy, onRemove, onUpdate
    } = this.props;

    let sections = {
      Public: accessFilter('public', documents),
      Private: accessFilter('private', documents)
    };

    return(
      <div className={ `document-window ${documentType}-window` }>
        <div className='left-column-group'>
          <ListMenu name={ documentType }
            create={ onCreate }
            select={ onSelect }
            sections={ sections }/>
        </div>
        <div className='right-column-group'>
          <DocumentView
            editing={ editing }
            onEdit={ onEdit }
            onCancel={ onCancel }
            onRun={ onRun }
            onSave={ onSave }
            onCopy={ onCopy }
            onRemove={ onRemove }
            onUpdate={ onUpdate }
            document={ document } >
            { children }
          </DocumentView>
        </div>
      </div>
    );
  }
}
