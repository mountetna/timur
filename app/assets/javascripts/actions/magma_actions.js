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
          dispatch(magmaActions.addTemplate(response.template))
          dispatch(magmaActions.addDocumentsForTemplate(response.template.name, response.documents))
          if (success != undefined) success()
        },
        error: function(message) {
          if (error != undefined) error(message)
        }
      })
    }
  },
  addTemplate: function(template) {
    return {
      type: 'ADD_TEMPLATE',
      template_name: template.name,
      template: template,
    }
  },
  addDocumentsForTemplate: function(template_name, documents) {
    return {
      type: 'ADD_DOCUMENTS',
      template_name: template_name,
      documents: documents
    }
  }
}

module.exports = magmaActions;
