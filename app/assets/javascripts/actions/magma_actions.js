var magmaActions = {
  requestTemplateAndDocuments: function( model_name, record_names, success, error ) {
    // this is an async action to get a new model from magma
    var self = this;
    var request = {
      model_name: model_name,
      record_names: record_names
    };
    return function(dispatch) {
      $.ajax({
        url: Routes.template_json_path(),
        method: 'POST',
        data: JSON.stringify(request), 
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          dispatch(magmaActions.addTemplate(response.template, response.patched_template))
          dispatch(magmaActions.addDocumentsForTemplate(response.template.name, response.documents, response.patched_documents))
          if (success != undefined) success()
        },
        error: function(message) {
          if (error != undefined) error(message)
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
    var request = {
      model_name: template_name,
      record_name: document_name,
      revision: revision
    };
    return function(dispatch) {
      $.ajax({
        url: Routes.update_model_path(),
        method: 'POST',
        data: JSON.stringify(request), 
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          if (success != undefined) success()
        },
        error: function(message) {
          if (error != undefined) error(message)
        }
      })
    }
  }
}

module.exports = magmaActions;
