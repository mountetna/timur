import * as React from 'react';

import DocumentView from './document_view';
import ListMenu from '../list_menu';

const groupByFeature = (documents, featureName) => {
  return documents.reduce((res, x) => {
  let key = x[featureName];
  if (!res[key]) res[key] = [x];
  else res[key].push(x);
  return res;
  }, {});
};

const DocumentWindow = (props) => {
  let {
    documentType,
    document,
    documents,
    editing,
    children,
    onCreate,
    onSelect,
    onEdit,
    onCancel,
    onRun,
    onSave,
    onCopy,
    onRemove,
    onUpdate
  } = props;

  let groupKey;
  if (documentType === 'view') groupKey = 'model_name';
  else groupKey = 'access';

  let sections = groupByFeature(documents || [], groupKey);

  return (
    <div className={`document-window ${documentType}-window`}>
      <div className='left-column-group'>
        <ListMenu
          name={documentType}
          create={onCreate}
          select={onSelect}
          sections={sections}
        />
      </div>
      <div className='right-column-group'>
        <DocumentView
          editing={editing}
          onEdit={onEdit}
          onCancel={onCancel}
          onRun={onRun}
          onSave={onSave}
          onCopy={onCopy}
          onRemove={onRemove}
          onUpdate={onUpdate}
          document={document}
        >
          {children}
        </DocumentView>
      </div>
    </div>
  );

};

export default DocumentWindow;