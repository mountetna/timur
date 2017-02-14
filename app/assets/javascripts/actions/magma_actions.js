var magmaActions = {
  consumePayload: function(dispatch,response) {
    if (response.models) {
      Object.keys(response.models).forEach(function(model_name) {
        model = response.models[model_name]

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
    if (response.tables) {
      response.tables.forEach(function(table) {
        dispatch(
          magmaActions.addTable(table)
        )
      })
    }
  },
  queryData: function( model_name, params, queries, success, error ) {
    var self = this;
    var request = {
      model_name: model_name,
      queries: queries
    }

    var replaceParams = function(item,params) {
      Object.keys(params).forEach(function(name) {
        item = item.replace("@"+name,params[name])
      })
      return item
    }

    var recursiveReplace = function(array, params) {
      return array.map(function(item) {
        if (item instanceof Array)
          return recursiveReplace(item,params)
        else
          return replaceParams(item,params)
      })
    }

    queries.forEach(function(query) {
      query.name = replaceParams(query.name, params)
      query.rows = recursiveReplace(query.rows, params)
      Object.keys(query.columns).forEach(function(column_name) {
        query.columns[column_name] = recursiveReplace(query.columns[column_name], params)
      })
    })

    return function(dispatch) {
      $.ajax({
        url: Routes.query_json_path(),
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
    return function(dispatch) {
      $.get(
        Routes.templates_json_path(),
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
  addTable: function(table) {
    return {
      type: 'ADD_TABLE',
      table_name: table.name,
      table: table
    }
  },
  reviseDocument: function(document, template, attribute, revised_value) {
    var revision = { }
    revision[ attribute.name ] = revised_value
    return {
      type: 'REVISE_DOCUMENT',
      model_name: template.name,
      record_name: document[ template.identifier ],
      revision: revision
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
    data.append( 'model_name', model_name )
    //data.append( 'record_name', record_name )
    Object.keys(revisions).forEach(function(record_name) {
      var revision = revisions[record_name]
      Object.keys(revision).forEach(function(key) {
        if (Array.isArray(revision[key])) {
          revision[key].forEach(function(value) {
            data.append( 'revisions['+record_name+']['+key+'][]', value )
          })
        }
        else
          data.append( 'revisions['+record_name+']['+key+']', revision[key] )
      })
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
