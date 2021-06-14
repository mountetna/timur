import React, {useCallback, useContext} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {QueryContext} from '../../contexts/query/query_context';
import QueryModelAttributeSelector from './query_model_attributes_selector';

const QueryFromPane = () => {
  const {state, setRootModel, setAttributes} = useContext(QueryContext);

  let reduxState = useReduxState();

  const onRootModelSelect = useCallback(
    (modelName: string) => {
      if ('' !== modelName) {
        let template = selectTemplate(reduxState, modelName);
        setRootModel(modelName, {
          model_name: modelName,
          attribute_name: template.identifier,
          display_label: `${modelName}.${template.identifier}`
        });
      } else {
        setRootModel(null, null);
      }
    },
    [state.rootModel, reduxState]
  );

  return (
    <Card>
      <CardHeader title='From' subheader='the root model for your data frame' />
      <CardContent>
        <QueryModelAttributeSelector
          label='Root Model'
          modelValue={state.rootModel || ''}
          modelChoiceSet={
            state.graph && state.graph.allowedModels
              ? [...state.graph.allowedModels]
              : []
          }
          onSelectModel={(modelName) => onRootModelSelect(modelName)}
          onSelectAttributes={setAttributes}
          selectedAttributes={
            state.rootModel && state.attributes
              ? state.attributes[state.rootModel]
              : []
          }
          canRemove={false}
          removeModel={() => {}}
        />
      </CardContent>
    </Card>
  );
};

export default QueryFromPane;
