var magmaActions = {
  consumePayload: function(dispatch,response) {
    Object.keys(response.templates).forEach(function(template_name) {
      template_def = response.templates[template_name]

      // you may not have all of these
      
      if (template_def.template)
        dispatch(
          magmaActions.addTemplate(
            template_def.template,
            template_def.patched_template)
        )
      if (template_def.documents)
        dispatch(
          magmaActions.addDocumentsForTemplate(
            template_name, 
            template_def.documents, 
            template_def.patched_documents
          )
        )
    })
  },
  requestModels: function() {
    return function(dispatch) {
      $.get(
        Routes.search_json_path(),
        function(response) {
          magmaActions.consumePayload(dispatch,response)
        }
      )
    }
  },
  requestIdentifiers: function() {
    return function(dispatch) {
      $.get(
        Routes.identifiers_json_path(),
        function(response) {
          magmaActions.consumePayload(dispatch,response)
        }
      )
    }
  },
  requestAllDocuments: function( model_name, success, error ) {
    var self = this;
    var request = {
      model_name: model_name
    }
    return function(dispatch) {
      $.ajax({
        url: Routes.table_json_path(),
        method: 'POST',
        data: JSON.stringify(request), 
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          magmaActions.consumePayload(dispatch,response)
          if (success != undefined) success()
        },
        error: function(xhr, status, err) {
          if (error != undefined) {
            var message = JSON.parse(xhr.responseText)
            error(message)
          }
        }
      })
    }
  },
  requestTemplateAndDocuments: function( model_name, record_names, success, error ) {
    // this is an async action to get a new model from magma
    var self = this;
    var request = {
      model_name: model_name,
      record_names: record_names
    }
    return function(dispatch) {
      $.ajax({
        url: Routes.template_json_path(),
        method: 'POST',
        data: JSON.stringify(request), 
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          magmaActions.consumePayload(dispatch,response)
          if (success != undefined) success()
        },
        error: function(xhr, status, err) {
          if (error != undefined) {
            var message = JSON.parse(xhr.responseText)
            error(message)
          }
        }
      })
    }
  },
  addTemplate: function(template,patched_template) {
    return {
      type: 'ADD_TEMPLATE',
      template_name: template.name,
      patched_template: patched_template,
      template: template,
    }
  },
  addDocumentsForTemplate: function(template_name, documents, patched_documents) {
    return {
      type: 'ADD_DOCUMENTS',
      template_name: template_name,
      documents: documents,
      patched_documents: patched_documents
    }
  },
  reviseDocument: function(document, template, attribute, revised_value) {
    var revision = { }
    revision[ attribute.name ] = revised_value
    return {
      type: 'REVISE_DOCUMENT',
      template_name: template.name,
      document_name: document[ template.identifier ],
      revision: revision
    }
  },
  discardRevision: function(document_name, template_name) {
    return {
      type: 'DISCARD_REVISION',
      template_name: template_name,
      document_name: document_name
    }
  },
  postRevision: function(document_name, template_name, revision, success, error) {
    var self = this;
    var data = new FormData()
    data.append( 'model_name', template_name )
    data.append( 'record_name', document_name )
    Object.keys(revision).forEach(function(key) {
      if (Array.isArray(revision[key])) {
        revision[key].forEach(function(value) {
          data.append( 'revision['+key+'][]', value )
        })
      }
      else
        data.append( 'revision['+key+']', revision[key] )
    })
    return function(dispatch) {
      $.ajax({
        url: Routes.update_model_path(),
        method: 'POST',
        data: data,
        processData: false,
        contentType: false,
        success: function(response) {
          if (success != undefined) success()
          magmaActions.consumePayload(dispatch,response)
        },
        error: function(xhr, status, err) {
          if (error != undefined) {
            var message = JSON.parse(xhr.responseText)
            error(message)
          }
        }
      })
    }
  }
}

module.exports = magmaActions;
