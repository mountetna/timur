var magmaActions = {
  consumePayload: function(dispatch,response) {
    if (response.models) {
      Object.keys(response.models).forEach(function(model_name) {
        var model = response.models[model_name]

        // you may not have all of these
        
        if (model.template)
          dispatch( 
            magmaActions.addTemplate(model.template)
          )
        if (model.documents)
          dispatch(
            magmaActions.addDocumentsForTemplate(model_name, model.documents)
          )
      })
    }
  },
  requestDocuments: function( model_name, record_names, attribute_names, success, error ) {
    // this is an async action to get a new model from magma
    var self = this;
    var request = {
      model_name: model_name,
      record_names: record_names,
      attribute_names: attribute_names
    }
    return function(dispatch) {
      $.ajax({
        url: Routes.records_json_path(),
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
  requestModels: function() {
    return magmaActions.requestDocuments("all", [], "all")
  },
  requestIdentifiers: function() {
    return magmaActions.requestDocuments("all", "all", "identifier")
  },
  queryDocuments: function( model_name, filter, success, error ) {
    var self = this;
    var request = {
      model_name: model_name,
      filter: filter
    }
    return function(dispatch) {
      $.ajax({
        url: Routes.table_json_path(),
        data: JSON.stringify(request), 
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          if (success != undefined) success(response)
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
  addTemplate: function(template) {
    return {
      type: 'ADD_TEMPLATE',
      model_name: template.name,
      template: template
    }
  },
  addDocumentsForTemplate: function(model_name, documents) {
    return {
      type: 'ADD_DOCUMENTS',
      model_name: model_name,
      documents: documents
    }
  },
  reviseDocument: function(document, template, attribute, revised_value) {
    return {
      type: 'REVISE_DOCUMENT',
      model_name: template.name,
      record_name: document[ template.identifier ],
      revision: {
        [ attribute.name ]: revised_value
      }
    }
  },
  discardRevision: function(record_name, model_name) {
    return {
      type: 'DISCARD_REVISION',
      model_name: model_name,
      record_name: record_name
    }
  },
  postRevisions: function(model_name, revisions, success, error) {
    var self = this;
    var data = new FormData()
    for (var record_name in revisions) {
      var revision = revisions[record_name]
      for (var attribute_name in revision) {
        if (Array.isArray(revision[attribute_name])) {
          revision[attribute_name].forEach(function(value) {
            data.append(
              `revisions[${model_name}][${record_name}][${attribute_name}][]`, value 
            )
          })
        }
        else
          data.append(
            `revisions[${model_name}][${record_name}][${attribute_name}]`,
            revision[attribute_name]
          )
      }
    }
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
