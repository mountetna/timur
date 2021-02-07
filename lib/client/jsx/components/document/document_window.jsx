
// Framework libraries.
import * as React from 'react';

import DocumentView from './document_view';
import ListMenu from '../list_menu';

const accessFilter = (access, documents)=>{
  return documents.filter(m => m.access == access).sort((a,b) => a > b);
};

export const publicPrivateSections = (documents) => ({
  Public: accessFilter('public', documents),
  Private: accessFilter('private', documents)
});

export default class DocumentWindow extends React.Component{
  render() {
    let {
      documentType, document, documents, editing, children,
      onCreate, onSelect, onEdit, onCancel,
      onRun, onSave, onCopy, onRemove, onUpdate,
      documentTitle, documentId, documentName
    } = this.props;

    return(
      <div className={ `document-window ${documentType}-window` }>
        <div className='left-column-group'>
          <ListMenu name={ documentType }
            create={ onCreate }
            select={ onSelect }
            sections={ Array.isArray(documents) ? null : documents }
            items={ Array.isArray(documents) ? documents : null }
            documentId={documentId}
            documentTitle={documentTitle}
            documentName={documentName}
          />
        </div>
        <div className='right-column-group'>
          <DocumentView
            documentName={documentName}
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
