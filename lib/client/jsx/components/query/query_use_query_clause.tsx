import React, {useMemo, useState, useEffect} from 'react';
import _ from 'lodash';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
import {requestAnswer} from 'etna-js/actions/magma_actions';
import {QueryClause} from '../../contexts/query/query_types';
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
  const [attributeOptions, setAttributeOptions] = useState([] as string[]);
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
      if (!template) return 'string';

      return template.attributes[
        clause.attributeName
      ].attribute_type.toLowerCase();
    }
    return 'string';
  }, [clause.attributeName, clause.modelName, graph]);

  useEffect(() => {
    return;
  }, [clause, invoke]);

  return {
    modelAttributes,
    attributeType,
    attributeOptions
  };
};

export default useQueryClause;
