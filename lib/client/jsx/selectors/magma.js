import * as Reselect from 'reselect';

export const displayAttributes = (template) =>
  template &&
  Object.keys(template.attributes).filter(
    (attribute_name) =>
      !template.attributes[attribute_name].hidden &&
      template.attributes[attribute_name].attribute_type != 'table'
  );

export const selectModelNames = (state) =>
  Object.keys(state.magma.models).sort();

const selectModels = (state) => state.magma.models;

const selectModel = (state, model_name) =>
  selectModels(state)[model_name] || null;

export const selectIdentifiers = Reselect.createSelector(
  selectModels,
  (models) =>
    Object.keys(models).reduce((idents, model_name) => {
      idents[model_name] = Object.keys(models[model_name].documents);
      return idents;
    }, {})
);

export const selectTemplate = (state, model_name) => {
  let model = selectModel(state, model_name);
  return model && model.template;
};

const meetsTerms = (template, document, terms) =>
  terms.every(
    (term) =>
      matchesAttribute(term, template, document) ||
      matchesAny(term, template, document)
  );

const copyFrom = (documents) => (docs, name) => {
  if (name in documents) docs[name] = documents[name];
  return docs;
};

const filterDocuments = (template, documents, filter) => {
  if (!documents || !Object.keys(documents).length) return null;

  let terms = filter.split(/\s+/).filter((term) => term.length > 0);
  if (!terms.length) return documents;

  let filtered_documents = Object.keys(documents)
    .filter((record_name) =>
      meetsTerms(template, documents[record_name], terms)
    )
    .reduce(copyFrom(documents), {});

  return filtered_documents;
};

const formatAttribute = (document, template, att_name) => {
  let value = document[att_name];
  if (value == undefined) return '';

  let attribute = template.attributes[att_name];
  let {attribute_type} = attribute;

  switch (attribute_type) {
    case 'file':
    case 'image':
      return value.url;
    case 'collection':
      return value.join(',');
    case 'table':
      return '';
    case 'link':
    case 'parent':
    case 'child':
      return value || '';
    case 'date_time':
      return Dates.formatDate(value) + '@' + Dates.formatTime(value);
    case 'integer':
    case 'float':
      return value || 0;
    case 'string':
    default:
      return value || '';
  }
};

const matchesAttribute = (term, template, document) => {
  let match = RegExp(
    '^' +
    '([\\w]+)' + // The attribute name.
    '([=<>~])' + // The operator.
    '(.*)' + // The rest.
      '$'
  ).exec(term);

  if (!match) return false;

  let [, att_name, operator, match_txt] = match;

  if (!displayAttributes(template).includes(att_name)) return false;

  let txt = formatAttribute(document, template, att_name);

  switch (operator) {
    case '=':
      return txt == match_txt;
    case '~':
      return txt.match(new RegExp(match_txt, 'i'));
    case '<':
      return txt < match_txt;
    case '>':
      return txt > match_txt;
  }
  return false;
};

const matchesAny = (term, template, document) =>
  displayAttributes(template).some((att_name) => {
    let txt = formatAttribute(document, template, att_name);
    return txt.match && txt.match(new RegExp(term, 'i'));
  });

export const selectDocuments = (state, model_name, record_names, filter) => {
  let model = selectModel(state, model_name);

  if (!record_names || !model || !model.documents) return {};

  let documents = record_names.reduce(copyFrom(model.documents), {});

  documents = filter
    ? filterDocuments(selectTemplate(state, model_name), documents, filter)
    : documents;

  return documents;
};

export const selectDocument = (state, model_name, record_name) => {
  let model = selectModel(state, model_name);
  return model && model.documents && model.documents[record_name];
};

export const selectRevision = (state, model_name, record_name) => {
  let model = selectModel(state, model_name);
  return model && model.revisions && model.revisions[record_name];
};

export const filePathComponents = (metisPath) => {
  const metisUrlPathRegex = new RegExp(
    '^https://' +
      // hostname
      '([^/]*?)/' +
      // project_name
      '([^/]*?)/' +
      '(upload|download)/' +
      // bucket_name
      '([^/]*?)/' +
      // folder path + filename without query params
      '([^?]*)?.*'
  );
  const results = metisPath.match(metisUrlPathRegex);

  return {
    hostname: results[1],
    project_name: results[2],
    bucket_name: results[4],
    file_name: results[5]
  };
};
