import { showMessages } from './message_actions'
import { getDocuments, postRevisions } from '../api/timur'

export const consumePayload = (dispatch,response) => {
  if (response.models) {
    Object.keys(response.models).forEach((model_name) => {
      let model = response.models[model_name]

      if (model.template)
        dispatch( 
          addTemplate(model.template)
        )
      if (model.documents)
        dispatch(
          addDocumentsForTemplate(model_name, model.documents)
        )
    })
  }
}

export const requestDocuments = ( model_name, record_names, attribute_names, collapse_tables, success, error ) => (dispatch) => 
  getDocuments(
    model_name,record_names,attribute_names,collapse_tables
  )
    .then(
      (response) => {
        consumePayload(dispatch,response)
        if (success != undefined) success()
      }
    )
    .catch(
      (error) => {
        if (error != undefined) {
          var message = JSON.parse(error.response)
          error(message)
        }
      }
    )

export const requestModels = () => requestDocuments("all", [], "all")

export const requestIdentifiers = () => requestDocuments("all", "all", "identifier")

export const addTemplate = (template) => (
  {
    type: 'ADD_TEMPLATE',
    model_name: template.name,
    template: template
  }
)

export const addDocumentsForTemplate = (model_name, documents) => (
  {
    type: 'ADD_DOCUMENTS',
    model_name: model_name,
    documents: documents
  }
)

export const reviseDocument = (document, template, attribute, revised_value) => (
  {
    type: 'REVISE_DOCUMENT',
    model_name: template.name,
    record_name: document[ template.identifier ],
    revision: {
      [ attribute.name ]: revised_value
    }
  }
)

export const discardRevision = (record_name, model_name)  => (
  {
    type: 'DISCARD_REVISION',
    model_name: model_name,
    record_name: record_name
  }
)

const revision_name = (model_name, record_name, attribute_name) =>
  `revisions[${model_name}][${record_name}][${attribute_name}]`

export const sendRevisions = (model_name, revisions, success, error) => (dispatch) => {
  var data = new FormData()

  for (var record_name in revisions) {
    var revision = revisions[record_name]
    for (var attribute_name in revision) {
      if (Array.isArray(revision[attribute_name])) {
        revision[attribute_name].forEach(
          (value) => data.append(
            revision_name(
              model_name,record_name,attribute_name
            )+'[]', value
          )
        )
      }
      else
        data.append(
          revision_name(model_name,record_name,attribute_name),
          revision[attribute_name]
        )
    }
  }

  postRevisions(data)
    .then((response) => {
      consumePayload(dispatch,response)
      dispatch(
        discardRevision(
          record_name,
          model_name
        )
      )
      if (success != undefined) success()
    })
    .catch((e) => {
       e.response.json().then((response) =>
         dispatch(
           showMessages([
`### The change we sought did not occur.

${response.errors.map((error) => `* ${error}`)}`
           ])
         )
       )
       if (error != undefined) error()
      })
  }
