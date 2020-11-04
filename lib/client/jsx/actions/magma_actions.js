import {showMessages} from './message_actions';
import {Exchange} from './exchange_actions';
import {
  getDocuments,
  getAnswer,
  getTSVForm,
  postRevisions
} from '../api/magma_api';
import {fileSelected} from 'etna-js/upload/actions/upload_actions';

export const ADD_TEMPLATE = 'ADD_TEMPLATE';
export const ADD_DOCUMENTS = 'ADD_DOCUMENTS';
export const REVISE_DOCUMENT = 'REVISE_DOCUMENT';
export const DISCARD_REVISION = 'DISCARD_REVISION';
export const ADD_PREDICATES = 'ADD_PREDICATES;';

export const addTemplate = (template) => {
  return {
    type: ADD_TEMPLATE,
    model_name: template.name,
    template: template
  };
};

export const addDocumentsForTemplate = (model_name, documents) => {
  return {
    type: ADD_DOCUMENTS,
    model_name: model_name,
    documents: documents
  };
};

export const reviseDocument = (
  document,
  template,
  attribute,
  revised_value
) => {
  return {
    type: REVISE_DOCUMENT,
    model_name: template.name,
    record_name: document[template.identifier],
    revision: {
      [attribute.name]: revised_value
    }
  };
};

export const discardRevision = (record_name, model_name) => {
  return {
    type: DISCARD_REVISION,
    model_name: model_name,
    record_name: record_name
  };
};

export const addPredicates = (predicates) => {
  return {
    type: ADD_PREDICATES,
    predicates
  };
};

/*
 * Here we add the models and documents to the store. At the same time we strip
 * off the model namespacing. The server returns the full name of the model.
 * And we want that behavior so we can know from which project the data is
 * coming from. However, we do not want to propigate that namespacing to the UI.
 */
export const consumePayload = (dispatch, response) => {
  if (response.models) {
    Object.keys(response.models).forEach((model_name) => {
      let model = response.models[model_name];

      if (model.template) {
        dispatch(addTemplate(model.template));
      }

      if (model.documents) {
        dispatch(addDocumentsForTemplate(model_name, model.documents));
      }
    });
  }
};

export const requestDocuments = (args) => {
  let {
    model_name,
    record_names,
    attribute_names,
    filter,
    page,
    page_size,
    collapse_tables,
    exchange_name
  } = args;

  return (dispatch) => {
    let handleRequestSuccess = (response) => {
      if ('error' in response) {
        dispatch(showMessages([`There was a ${response.type} error.`]));
        console.log(response.error);
        return;
      }

      consumePayload(dispatch, response);
      return Promise.resolve(response);
    };

    let handleRequestError = (e) => {
      if (!e.response) {
        dispatch(showMessages([`Something is amiss. ${e}`]));
        return;
      }

      e.response.json().then((response) => {
        let errStr = response.error
          ? response.error
          : response.errors.map((error) => `* ${error}`);
        errStr = [`### Our request was refused.\n\n${errStr}`];
        dispatch(showMessages(errStr));
      });
      return new Promise((resolve, reject) => {
        reject(e);
      });
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

    return getDocuments(...get_doc_args)
      .then(handleRequestSuccess)
      .catch(handleRequestError);
  };
};

export const requestModels = () => {
  let reqOpts = {
    model_name: 'all',
    record_names: [],
    attribute_names: 'all',
    exchange_name: 'request-models'
  };

  return requestDocuments(reqOpts);
};

export const requestIdentifiers = () => {
  let reqOpts = {
    model_name: 'all',
    record_names: 'all',
    attribute_names: 'identifier',
    exchange_name: 'request-identifiers'
  };

  return requestDocuments(reqOpts);
};

const uploadFileRevisions = (model_name, revisions, response) => {
  // Handle any file upload revisions by sending the file to Metis.
  // Here Magma's response should be a temporary upload URL.
  // 1. Find the file attributes from the response.models.model_name.template.attributes.
  // 2. Grab the file(s) from the original revisions list for each record.
  // 3. Upload the file(s) to Metis.
  // 4. Send another update to Magma with the file location(s) and
  //      original filenames.
  // 5. Update the response with final Magma URLs for each file attribute.
  // 6. Return the response via a Promise.
  const modelAttributes = response.models[model_name].template.attributes;
  const fileAttributeNames = fileAttributeNamesForModel(modelAttributes);
  uploadTemporaryFiles(revisions, fileAttributeNames);
};

const fileAttributeNamesForModel = (modelAttributes) => {
  const fileAttributeNames = [];
  Object.keys(modelAttributes).forEach((attribute_name) => {
    let attribute = modelAttributes[attribute_name];
    if (
      attribute.attribute_type === 'file' ||
      attribute.attribute_type === 'image'
    ) {
      fileAttributeNames.push(attribute.attribute_name);
    }
  });
  return fileAttributeNames;
};

const uploadTemporaryFiles = (revisions, fileAttributeNames) => {
  revisions.forEach((revision) => {
    Object.keys(revision).forEach((revisionAttributeName) => {
      if (fileAttributeNames.indexOf(revisionAttributeName) === -1) {
        return;
      }

      const fileRevision = revision[revisionAttributeName];
      let {bucket_name, folder_name} = filePathComponents(fileRevision.path);

      fileSelected({
        bucket_name,
        folder_name,
        file: fileRevision.original_files[0]
      });
    });
  });
};

export const sendRevisions = (model_name, revisions, success, error) => {
  return (dispatch) => {
    let localSuccess = (response) => {
      debugger;
      uploadFileRevisions(model_name, revisions, response).then(
        (updatedResponse) => {
          consumePayload(dispatch, updatedResponse);
          for (var record_name in revisions) {
            dispatch(discardRevision(record_name, model_name));
          }

          if (success != undefined) success();
        }
      );
    };

    let localError = (e) => {
      e.response.json().then((response) => {
        let errStr = response.error
          ? response.error
          : response.errors.map((error) => `* ${error}`);
        errStr = [`### The change we sought did not occur.\n\n${errStr}`];
        dispatch(showMessages(errStr));
      });

      if (error != undefined) error();
    };

    let exchng = new Exchange(dispatch, `revisions-${model_name}`);
    postRevisions(formatRevisions(revisions, model_name), exchng)
      .then(localSuccess)
      .catch(localError);
  };
};

const formatRevisions = (revisions, model_name) => {
  const modelRevisions = {};
  modelRevisions[model_name] = revisions;

  const formattedRevs = {
    revisions: modelRevisions
  };
  return formattedRevs;
};

// Download a TSV from magma via Timur.
export const requestTSV = (model_name, filter, attribute_names) => {
  return (dispatch) => {
    getTSVForm(model_name, filter, attribute_names);
  };
};

export const requestAnswer = (question, callback) => {
  return (dispatch) => {
    let localSuccess = (response) => {
      if ('error' in response) {
        dispatch(showMessages([`There was a ${response.type} error.`]));
        console.log(response.error);
        return;
      }

      if (callback != undefined) callback(response);
    };

    let localError = (error) => {
      console.log(error);
    };

    let question_name = question;
    if (Array.isArray(question)) {
      question_name = [].concat.apply([], question).join('-');
    }
    let exchange = new Exchange(dispatch, question_name);
    getAnswer(question, exchange).then(localSuccess).catch(localError);
  };
};

export const requestPredicates = () => {
  return (dispatch) => {
    let localCallback = (response) => {
      dispatch(addPredicates(response.predicates));
    };

    dispatch(requestAnswer('::predicates', localCallback));
  };
};
