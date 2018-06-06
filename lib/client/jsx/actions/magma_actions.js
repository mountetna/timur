import {showMessages} from './message_actions';
import {Exchange} from './exchange_actions';
import * as MagmaAPI from '../api/magma_api';

export const reviseDocument = (args, project_name)=>{

  // Unpack the arguments.
  if(project_name == undefined) project_name = TIMUR_CONFIG.project_name;
  let {document, template, attribute, revised_value} = args;

  return {
    type: 'REVISE_DOCUMENT',
    model_name: `${project_name}_${template.name}`,
    record_name: document[template.identifier],
    revision: {
      [attribute.name]: revised_value
    }
  };
};

export const discardRevision = (args, project_name)=>{

  // Unpack the arguments.
  if(project_name == undefined) project_name = TIMUR_CONFIG.project_name;
  let {record_name, model_name} = args;

  return {
    type: 'DISCARD_REVISION',
    model_name: `${project_name}_${model_name}`,
    record_name: record_name
  };
};

/*
 * Functions that are used locally (not exported) do no require that the 
 * 'project_name' be declared. The calling functions should already have set the
 * project namespacing.
 */
const addTemplate = (template_name, template)=>{
  return {
    type: 'ADD_TEMPLATE',
    model_name: template_name,
    template
  };
};

const addDocumentsForTemplate = (model_name, documents)=>{
  return {
    type: 'ADD_DOCUMENTS',
    model_name,
    documents
  };
};

const addPredicates = (predicates)=>{
  return {
    type: 'ADD_PREDICATES',
    predicates
  };
};

const addDictionary = (dictionary_name, definitions)=>{
  return {
    type: 'ADD_DICTIONARY',
    dictionary_name,
    definitions
  };
};

/*
 * Here we add the models and documents to the store. At the same time we strip
 * off the model namespacing. The server returns the full name of the model.
 * And we want that behavior so we can know from which project the data is
 * coming from. However, we do not want to propigate that namespacing to the UI.
 */
const consumePayload = (dispatch, response, project_name)=>{
  if(response.models){
    Object.keys(response.models).forEach((model_name)=>{
      let model = response.models[model_name];

      if(model.template){
        dispatch(addTemplate(
          `${project_name}_${model_name}`,
          model.template
        ));
      }

      if(model.documents){
        dispatch(addDocumentsForTemplate(
          `${project_name}_${model_name}`,
          model.documents,
        ));
      }
    });
  }
};

export const requestDocuments = (args, project_name)=>{

  // Unpack the arguments.
  if(project_name == undefined) project_name = TIMUR_CONFIG.project_name;
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

      consumePayload(dispatch, response, project_name);
      if(success != undefined) success(response);
    };

    let localError = (e) => {
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

    let exchange = new Exchange(dispatch, exchange_name);
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
      exchange,
      project_name
    ];

    return MagmaAPI.getDocuments(...get_doc_args)
      .then(localSuccess)
      .catch(localError);
    }
};

export const requestDictionaries = (args, project_name)=>{

  // Unpack the arguments.
  if(project_name == undefined) project_name = TIMUR_CONFIG.project_name;
  let {dictionary_name} = args;

  return (dispatch)=>{
    let localSuccess = (response)=>{
      for(let dict_name in response.models){
        dispatch(addDictionary(
          `${project_name}_${dictionary_name}`,
          response.models[dictionary_name].documents
        ));
      }
    };

    let localError = (response)=>{
      console.log(response);
    };

    let exchange_name = `Dictionary ${dictionary_name} for ${project_name}`;
    let exchange = new Exchange(dispatch, exchange_name);
    let get_dict_args = [
      {
        model_name: dictionary_name,
        record_names: 'all',
        attribute_names: 'all'
      },
      exchange,
      project_name
    ];

    MagmaAPI.getDocuments(...get_dict_args)
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

export const sendRevisions = (args, project_name)=>{

  // Unpack the arguments.
  if(project_name == undefined) project_name = TIMUR_CONFIG.project_name;
  let {model_name, revisions, success, error} = args;

  return (dispatch)=>{

    let localSuccess = (response)=>{
      consumePayload(dispatch, response, project_name);

      for(let record_name in revisions){
        dispatch(discardRevision({record_name, model_name}, project_name));
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

    let exchange = new Exchange(dispatch, `revisions-${model_name}`);
    let revision_args = [
      setFormData(revisions, model_name),
      exchange,
      project_name
    ];

    MagmaAPI.postRevisions(...revision_args)
      .then(localSuccess)
      .catch(localError);
  }
};

// Download a TSV from magma via Timur.
export const requestTSV = (model_name, filter)=>{

  if(project_name == undefined) project_name = TIMUR_CONFIG.project_name;

  return (dispatch)=>{
    MagmaAPI.getTSVForm(model_name, filter, project_name);
  };
};

const requestAnswer = (question, callback, project_name)=>{

  if(project_name == undefined) project_name = TIMUR_CONFIG.project_name;

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
    MagmaAPI.getAnswer(question, exchange, project_name)
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
