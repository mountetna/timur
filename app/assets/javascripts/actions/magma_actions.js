// Class imports.
import { Exchange } from './exchange_actions';

// Module imports.
import { showMessages } from './message_actions';
import { getDocuments, postRevisions } from '../api/timur';

export const addTemplate = (template)=>(
  {
    type: 'ADD_TEMPLATE',
    model_name: template.name,
    template: template
  }
);

export const addDocumentsForTemplate = (model_name, documents)=>(
  {
    type: 'ADD_DOCUMENTS',
    model_name: model_name,
    documents: documents
  }
);

export const reviseDocument = (document, template, attribute, revised_value)=>(
  {
    type: 'REVISE_DOCUMENT',
    model_name: template.name,
    record_name: document[template.identifier],
    revision: {
      [ attribute.name ]: revised_value
    }
  }
);

export const discardRevision = (record_name, model_name)=>(
  {
    type: 'DISCARD_REVISION',
    model_name: model_name,
    record_name: record_name
  }
);

/*
 * Here we add the models and documents to the store. At the same time we strip
 * off the model namespacing. The server returns the full name of the model. 
 * And we want that behavior so we can know from which project the data is
 * coming from. However, we do not want to propigate that namespacing to the UI.
 */
export const consumePayload = (dispatch, response)=>{
  if(response.models){
    Object.keys(response.models).forEach((model_name)=>{
      let model = response.models[model_name];

      if(model.template){
        dispatch(addTemplate(model.template));
      }

      if(model.documents){
        dispatch(addDocumentsForTemplate(model_name, model.documents));
      }
    });
  }
};

export const requestDocuments = ({model_name, record_names, attribute_names, collapse_tables, exchange_name, success, error})=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      consumePayload(dispatch, response);
      if (success != undefined) success();
    };

    let localError = (e)=>{
      e.response.json().then((response)=>{
        let errStr = response.errors.map((error)=> `* ${error}`);
        errStr = [`### Our request was refused.\n\n${errStr}`];
        dispatch(showMessages(errStr));
      });

      if(error != undefined){
        let message = JSON.parse(error.response);
        error(message);
      }
    };

    let get_doc_args = [
      model_name,
      record_names,
      attribute_names,
      collapse_tables,
      new Exchange(dispatch, exchange_name)
    ];

    getDocuments(...get_doc_args)
      .then(localSuccess)
      .catch(localError);
  }
};

export const requestModels = ()=>{
  let reqOpts = {
    'model_name': 'all',
    'record_names': [],
    'attribute_names': 'all',
    'exchange_name': 'request-models'
  };

  return requestDocuments(reqOpts);
};

export const requestIdentifiers = ()=>{
  let reqOpts = {
    'model_name': 'all',
    'record_names': 'all',
    'attribute_names': 'identifier',
    'exchange_name': 'request-identifiers'
  };

  return requestDocuments(reqOpts);
};

const revision_name = (model_name, record_name, attribute_name)=>(
  `revisions[${model_name}][${record_name}][${attribute_name}]`
);

// Append the revised data to a form.
const setFormData = (revisions, model_name)=>{
  var form = new FormData();
  for(var record_name in revisions){

    var revision = revisions[record_name];
    for(var attribute_name in revision){

      if(Array.isArray(revision[attribute_name])){

        revision[attribute_name].forEach((value)=>{
          let rev_nm = revision_name(model_name, record_name, attribute_name);
          return form.append(rev_nm+'[]', value);
        });
      }
      else{
        let rev_nm = revision_name(model_name, record_name, attribute_name);
        form.append(rev_nm, revision[attribute_name]);
      }
    }
  }

  return form;
}

export const sendRevisions = (model_name, revisions, success, error)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      consumePayload(dispatch, response);

      for(var record_name in revisions){
        dispatch(
          discardRevision(
            record_name,
            model_name
          )
        );
      }

      if(success != undefined) success();
    };

    let localError = (e)=>{
      e.response.json().then((response)=>{
        let errStr = response.errors.map((error)=> `* ${error}`);
        errStr = [`### The change we sought did not occur.\n\n${errStr}`];
        dispatch(showMessages(errStr));
      });

      if(error != undefined) error();
    };

    let exchng = new Exchange(dispatch, `revisions-${model_name}`);
    postRevisions(setFormData(revisions, model_name), exchng)
      .then(localSuccess)
      .catch(localError);
  }
}

/*
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

  postRevisions(data, new Exchange(dispatch, `revisions-${model_name}`))
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
*/
