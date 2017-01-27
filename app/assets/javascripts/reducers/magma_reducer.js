/*
 *  models: {
 *    
 *    model_1: {
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
 *    model_2: {
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

var revisions = function(old_revisions, action) {
  if (!old_revisions) old_revisions = {}
  switch(action.type) {
    case 'REVISE_DOCUMENT':
      var new_revisions = {}
      new_revisions[action.record_name] = freshen(
        old_revisions[action.record_name],
        action.revision
      )
      return freshen( old_revisions, new_revisions )
    case 'DISCARD_REVISION':
      var new_revisions = {}
      new_revisions[action.record_name] = null
      return freshen( old_revisions, new_revisions )
    default:
      return old_revisions
  }
}

var model = function(old_model, action) {
  if (!old_model) old_model = {
    documents: {},
    revisions: {},
    views: {}
  }

  switch(action.type) {
    case 'ADD_TEMPLATE':
      return freshen( old_model, {
          template: action.template
        })
    case 'ADD_DOCUMENTS':
      return freshen( old_model, {
          documents: documents(old_model.documents,action),
        })
    case 'REVISE_DOCUMENT':
    case 'DISCARD_REVISION':
      return freshen( old_model, {
          revisions: revisions(old_model.revisions, action)
        })
    default:
      return old_model
  }
}

var models = function(models, action) {
  if (!models) models = {}
  switch(action.type) {
    case 'ADD_TEMPLATE':
    case 'ADD_DOCUMENTS':
    case 'REVISE_DOCUMENT':
    case 'DISCARD_REVISION':
      var new_models = { }
      new_models[action.model_name] = model(models[action.model_name], action)
      return freshen( models, new_models )
    default:
      return models
  }
}

var tables = function(old_tables, action) {
  if (!old_tables) old_tables = {}
  switch(action.type) {
    case 'ADD_TABLE':
      var new_tables = {}
      new_tables[action.table_name] = action.table
      return freshen( old_tables, new_tables )
    default:
      return old_tables
  }
}

var magmaReducer = function(magma, action) {
  if (!magma) magma = {
    models: {},
    tables: {}
  }
  switch(action.type) {
    case 'ADD_TEMPLATE':
    case 'ADD_DOCUMENTS':
    case 'REVISE_DOCUMENT':
    case 'DISCARD_REVISION':
      return freshen( magma, { models: models(magma.models, action) } )
    case 'ADD_TABLE':
      return freshen( magma, { tables: tables(magma.tables, action) } )
    default:
      return magma
  }
}

module.exports = magmaReducer
