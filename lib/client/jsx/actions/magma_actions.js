import {showMessages} from './message_actions';
import {Exchange} from './exchange_actions';
import * as MagmaAPI from '../api/magma_api';

export const addTemplate = (template)=>{
  return {
    type: 'ADD_TEMPLATE',
    model_name: template.name,
    template: template
  };
};

export const addDocumentsForTemplate = (model_name, documents)=>{
  return {
    type: 'ADD_DOCUMENTS',
    model_name: model_name,
    documents: documents
  };
};

export const reviseDocument = (document, template, attribute, revised_value)=>{
  return {
    type: 'REVISE_DOCUMENT',
    model_name: template.name,
    record_name: document[template.identifier],
    revision: {
      [attribute.name]: revised_value
    }
  }
};

export const discardRevision = (record_name, model_name)=>{
  return {
    type: 'DISCARD_REVISION',
    model_name: model_name,
    record_name: record_name
  };
};

export const addPredicates = (predicates)=>{
  return {
    type: 'ADD_PREDICATES',
    predicates
  };
};

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

export const requestDocuments = (args)=>{
  let {
    model_name,
    record_names,
    attribute_names,
    filter,
    page,
    page_size,
    collapse_tables,
    exchange_name,
    success,
    error
  } = args;

  return (dispatch)=>{
    let localSuccess = (response)=>{
      if('error' in response){
        dispatch(showMessages([`There was a ${response.type} error.`]));
        console.log(response.error);
        return;
      }

      consumePayload(dispatch, response);
      if(success != undefined) success(response);
    };

    let localError = (e)=>{
      if (!e.response) {
        dispatch(showMessages([`Something is amiss. ${e}`]));
        return;
      }


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
      {
        model_name,
        record_names,
        attribute_names,
        filter,
        page,
        page_size,
        collapse_tables
      },
      new Exchange(dispatch, exchange_name)
    ];

    return MagmaAPI.getDocuments(...get_doc_args)
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
};

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
    MagmaAPI.postRevisions(setFormData(revisions, model_name), exchng)
      .then(localSuccess)
      .catch(localError);
  }
};

// Download a TSV from magma via Timur.
export const requestTSV = (model_name,filter)=>{
  return (dispatch)=>{
    MagmaAPI.getTSVForm(model_name,filter);
  };
};

export const requestAnswer = (question, callback)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      if('error' in response){
        dispatch(showMessages([`There was a ${response.type} error.`]));
        console.log(response.error);
        return;
      }

      if(callback != undefined) callback(response);
    };

    let localError = (error)=>{
      console.log(error);
    };

    let question_name = question;
    if(Array.isArray(question)){
      question_name = [].concat.apply([], question).join('-');
    }
    let exchange = new Exchange(dispatch, question_name);
    MagmaAPI.getAnswer(question, exchange)
      .then(localSuccess)
      .catch(localError);
  };
}

export const requestPredicates = ()=>{
  return (dispatch)=>{

    let localCallback = (response)=>{
      dispatch(addPredicates(response.predicates));
    };

    dispatch(requestAnswer('::predicates', localCallback));
  };
};
