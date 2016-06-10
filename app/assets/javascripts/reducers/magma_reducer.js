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

var documents = function(old_documents, action) {
  if (!old_documents) old_documents = {}
  switch(action.type) {
    case 'ADD_DOCUMENTS':
      return $.extend(
        true,
        {},
        old_documents,
        action.documents
      )
    default:
      return old_documents
  }
}

var view = function(old_view, action) {
  if (!old_view) old_view = {}
  switch(action.type) {
    case 'ADD_VIEWS':
      new_view = {}
      Object.keys(action.views).forEach(function(tab_name) {
        new_view[tab_name] = old_view[tab_name] || action.views[tab_name]
      })
      return new_view
    default:
      return old_view
  }
}

var views = function(old_views, action) {
  if (!old_views) old_views = {}
  switch(action.type) {
    case 'ADD_VIEWS':
      new_views = {}
      new_views[action.document_name] = view(old_views[action.document_name], action)
      return $.extend(
        {},
        old_views,
        new_views
      )
    default:
      return old_views
  }
}

var revisions = function(old_revisions, action) {
  if (!old_revisions) old_revisions = {}
  switch(action.type) {
    case 'REVISE_DOCUMENT':
      var new_revisions = {}
      new_revisions[action.document_name] = freshen(
        old_revisions[action.document_name],
        action.revision
      )
      return freshen( old_revisions, new_revisions )
    case 'DISCARD_REVISION':
      var new_revisions = {}
      new_revisions[action.document_name] = null
      return freshen( old_revisions, new_revisions )
    default:
      return old_revisions
  }
}

var template = function(old_template, action) {
  if (!old_template) old_template = {
    template: {},
    documents: {},
    revisions: {},
    views: {}
  }

  switch(action.type) {
    case 'ADD_TEMPLATE':
      return freshen( old_template, {
          template: action.template
        })
    case 'ADD_VIEWS':
      return freshen( old_template, {
          views: views(old_template.views,action),
        })
    case 'ADD_DOCUMENTS':
      return freshen( old_template, {
          documents: documents(old_template.documents,action),
        })
    case 'REVISE_DOCUMENT':
    case 'DISCARD_REVISION':
      return freshen( old_template, {
          revisions: revisions(old_template.revisions, action)
        })
    default:
      return old_template
  }
}

var magmaReducer = function(templates, action) {
  if (!templates) templates = {}
  switch(action.type) {
    case 'ADD_TEMPLATE':
    case 'ADD_DOCUMENTS':
    case 'ADD_VIEWS':
    case 'REVISE_DOCUMENT':
    case 'DISCARD_REVISION':
      // update if it exists
      var new_templates = { }
      new_templates[action.template_name] = template(templates[action.template_name], action)
      return freshen( templates, new_templates )
    default:
      return templates
  }
}

module.exports = magmaReducer
