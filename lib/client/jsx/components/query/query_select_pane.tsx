import React, {useCallback, useContext, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import {QueryContext} from '../../contexts/query/query_context';
import QueryModelAttributeSelector from './query_model_attributes_selector';

const QuerySelectPane = () => {
  const [intersectionModels, setIntersectionModels] = useState([] as string[]);
  const {state, setAttributes} = useContext(QueryContext);

  const updateIntersectionModels = useCallback(
    (modelName: string, index: number) => {
      let updatedModels: string[] = [...intersectionModels];
      updatedModels[index] = modelName;
      setIntersectionModels(updatedModels);
    },
    [intersectionModels]
  );

  const removeIntersectionModel = useCallback(
    (index: number) => {
      let updatedModels: string[] = [...intersectionModels];
      let removedModelName: string = updatedModels.splice(index, 1)[0];
      setIntersectionModels(updatedModels);
      setAttributes(removedModelName, []);
    },
    [intersectionModels]
  );

  if (!state.rootModel) return null;

  return (
    <Card>
      <CardHeader
        title='Select'
        subheader='the additional models and attributes you want'
      />
      <CardContent>
        {intersectionModels.map((modelName: string, index: number) => {
          if (!state.rootModel) return;

          let choiceSet = [
            ...new Set(state.graph.allPaths(state.rootModel).flat())
          ]
            .filter(
              (m) => !intersectionModels.includes(m) && m !== state.rootModel
            )
            .concat([modelName]);
          return (
            <QueryModelAttributeSelector
              label='Intersection Model'
              modelValue={modelName}
              modelChoiceSet={choiceSet}
              onSelectModel={(newModelName) =>
                updateIntersectionModels(newModelName, index)
              }
              onSelectAttributes={setAttributes}
              selectedAttributes={
                modelName && state.attributes && state.attributes[modelName]
                  ? state.attributes[modelName]
                  : []
              }
              canRemove={true}
              removeModel={() => removeIntersectionModel(index)}
            />
          );
        })}
      </CardContent>
      <CardActions disableSpacing>
        {state.rootModel ? (
          <Tooltip
            title='Add intersection model'
            aria-label='add intersection model'
          >
            <IconButton
              aria-label='add model and attributes'
              onClick={() =>
                setIntersectionModels(intersectionModels.concat(['']))
              }
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </CardActions>
    </Card>
  );
};

export default QuerySelectPane;
