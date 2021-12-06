import React, {useMemo, useState, useCallback} from 'react';
import _ from 'lodash';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
import {requestAnswer} from 'etna-js/actions/magma_actions';
import {
  QueryClause,
  QueryColumn,
  QueryResponse
} from '../../contexts/query/query_types';
import {selectAllowedModelAttributes} from '../../selectors/query_selector';
import {visibleSortedAttributesWithUpdatedAt} from '../../utils/attributes';
import {QueryGraph} from '../../utils/query_graph';

const useQueryClause = ({
  clause,
  graph
}: {
  clause: QueryClause;
  graph: QueryGraph;
}) => {
  const [distinctAttributeValues, setDistinctAttributeValues] = useState(
    [] as string[]
  );
  const invoke = useActionInvoker();

  const modelAttributes = useMemo(() => {
    if ('' !== clause.modelName) {
      const template = graph.template(clause.modelName);
      if (!template) return [];

      let sortedTemplateAttributes = visibleSortedAttributesWithUpdatedAt(
        template.attributes
      );

      return selectAllowedModelAttributes(sortedTemplateAttributes);
    }
    return [];
  }, [clause.modelName, graph]);

  const attributeType = useMemo(() => {
    if ('' !== clause.attributeName) {
      const template = graph.template(clause.modelName);
      if (!template) return '';

      return template.attributes[
        clause.attributeName
      ].attribute_type.toLowerCase();
    }
    return '';
  }, [clause.attributeName, clause.modelName, graph]);

  const fetchDistinctAttributeValues = useCallback(
    (clause: QueryClause) => {
      if ('' === clause.modelName || '' === clause.attributeName) return;
      if ('string' !== clause.attributeType) return;

      invoke(
        requestAnswer({
          query: [clause.modelName, '::distinct', clause.attributeName]
        })
      )
        .then((response: QueryResponse) => {
          setDistinctAttributeValues(response.answer);
        })
        .catch((e: any) => {
          invoke(showMessages([e]));
        });
    },
    [invoke]
  );

  return {
    modelAttributes,
    attributeType,
    fetchDistinctAttributeValues,
    distinctAttributeValues
  };
};

export default useQueryClause;
