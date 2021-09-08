import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo
} from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import {QueryContext} from '../../contexts/query/query_context';
import QueryModelAttributeSelector from './query_model_attributes_selector';
import QueryClause from './query_clause';

const QuerySelectPane = () => {
  const [intersectionModels, setIntersectionModels] = useState([] as string[]);
  const {state, setAttributes} = useContext(QueryContext);

  useEffect(() => {
    if (
      intersectionModels.length === 0 &&
      Object.keys(state.attributes).length > 0
    ) {
      let nonRootModels = Object.keys(state.attributes).filter(
        (modelName) => modelName !== state.rootModel
      );
      setIntersectionModels(nonRootModels);
    }
  }, [state.attributes, state.rootModel, intersectionModels.length]);

  const removeModel = useCallback(
    (modelName: string) => {
      setAttributes(modelName, []);
    },
    [setAttributes]
  );

  const updateIntersectionModels = useCallback(
    (modelName: string, index: number) => {
      const previousModelName = intersectionModels[index];
      let updatedModels: string[] = [...intersectionModels];
      updatedModels[index] = modelName;
      setIntersectionModels(updatedModels);
      if (previousModelName !== modelName) removeModel(previousModelName);
    },
    [intersectionModels, removeModel]
  );

  const removeIntersectionModel = useCallback(
    (index: number) => {
      let updatedModels: string[] = [...intersectionModels];
      let removedModelName: string = updatedModels.splice(index, 1)[0];
      setIntersectionModels(updatedModels);
      removeModel(removedModelName);
    },
    [intersectionModels, removeModel]
  );

  const choiceSet = useMemo(() => {
    if (!state.rootModel) return [];

    let selectedModels = Object.keys(state.attributes);

    return [
      ...new Set(
        state.graph.allPaths(state.rootModel).flat().concat(state.rootModel)
      )
    ].filter((m) => !selectedModels.includes(m));
  }, [state.rootModel, state.graph, state.attributes]);

  if (!state.rootModel) return null;

  return (
    <QueryClause title='Columns'>
      {intersectionModels.map((modelName: string, index: number) => {
        if (!state.rootModel) return;

        return (
          <QueryModelAttributeSelector
            key={index}
            label='Join Model'
            modelValue={modelName}
            modelChoiceSet={[...new Set(choiceSet.concat(modelName))]}
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
      {state.rootModel ? (
        <Button
          onClick={() => setIntersectionModels(intersectionModels.concat(['']))}
          startIcon={<AddIcon />}
        >
          Attribute
        </Button>
      ) : null}
    </QueryClause>
  );
};

export default QuerySelectPane;
