// Framework libraries.
import * as React from 'react';

import DocumentView from './document_view';
import ListMenu from '../list_menu';


const groupByFeature = (documents, featureName) => {
  return Object.values(documents).reduce((res, x) => {
  let key = x[featureName];
  if (!res[key]) res[key] = [x];
  else res[key].push(x);
  return res;
  }, {});
};

const DocumentWindow = (props) => {
  let {
    documentType, document, documents, editing, children,
    onCreate, onSelect, onEdit, onCancel,
    onRun, onSave, onCopy, onRemove, onUpdate,
    documentTitle, documentId, documentName,
    canSave
  } = props;
  let groupKey;

  switch (documentType) {
    case 'view':
      groupKey = 'project_name';
      break;
    default:
      groupKey = 'access';
      break;
  }


  let sections = groupByFeature(documents || [], groupKey);

    return(
      <div className={ `document-window ${documentType}-window` }>
        <div className='left-column-group'>
          <ListMenu name={ documentType }
            create={ onCreate }
            select={ onSelect }
            sections={ sections }
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
            document={ document }
            canSave={ null == canSave ? true : canSave } >
            { children }
          </DocumentView>
        </div>
      </div>
    );
}
export default DocumentWindow;
