/*
 *  templates: {
 *    
 *    template_name1: {
 *      // this is a json document describing a Magma model
 *      template: {
 *      },
 *      documents: {
 *        // this is a json document describing a Magma record
 *        document_name1: {
 *          attribute1: value1
 *        }
 *      }
 *    },
 *    template_name2: {
 *      etc.
 *    }
 *  }
 */

documents = function(old_documents, action) {
  if (!old_documents) old_documents = {}
  switch(action.type) {
    case 'ADD_DOCUMENTS':
      return $.extend(
        {},
        old_documents,
        action.documents
      )
    default:
      return old_documents
  }
}

patched_documents = function(old_patched_documents, action) {
  if (!old_patched_documents) old_patched_documents = {}
  switch(action.type) {
    case 'ADD_DOCUMENTS':
      return (
        {},
        old_patched_documents,
        action.patched_documents
      )
    default:
      return old_patched_documents
  }
}

revisions = function(old_revisions, action) {
  if (!old_revisions) old_revisions = {}
  switch(action.type) {
    case 'REVISE_DOCUMENT':
      var new_revisions = {}
      new_revisions[action.document_name] = $.extend(
        {},
        old_revisions[action.document_name],
        action.revision
      )
      return $.extend( {}, old_revisions, new_revisions )
    case 'DISCARD_REVISION':
      var new_revisions = {}
      new_revisions[action.document_name] = null
      return $.extend( {}, old_revisions, new_revisions )
    default:
      return old_revisions
  }
}

template = function(old_template, action) {
  if (!old_template) old_template = {
    template: {},
    patched_template: {},
    documents: {},
    patched_documents: {},
    revisions: {}
  }

  switch(action.type) {
    case 'ADD_TEMPLATE':
      return $.extend(
        {},
        old_template,
        {
          template: action.template,
          patched_template: action.patched_template,
        }
      )
    case 'ADD_DOCUMENTS':
    case 'REVISE_DOCUMENT':
    case 'DISCARD_REVISION':
      return $.extend(
        {},
        old_template,
        {
          documents: documents(old_template.documents,action),
          patched_documents: patched_documents( old_template.patched_documents, action),
          revisions: revisions(old_template.revisions, action)
        }
      )
    default:
      return old_template
  }
}

magmaReducer = function(templates, action) {
  if (!templates) templates = {}
  switch(action.type) {
    case 'ADD_TEMPLATE':
    case 'ADD_DOCUMENTS':
    case 'REVISE_DOCUMENT':
    case 'DISCARD_REVISION':
      // update if it exists
      var new_templates = { }
      new_templates[action.template_name] = template(templates[action.template_name], action)
      return $.extend( {}, templates, new_templates )
    default:
      return templates
  }
}
