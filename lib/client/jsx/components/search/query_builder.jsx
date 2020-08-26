import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {connect} from "react-redux";
import {
  selectDisplayAttributeNamesAndTypes,
  selectSortedAttributeNames
} from "../../selectors/search";
import {setFilterString, setSearchAttributeNames} from "../../actions/search_actions";
import {useModal} from "etna-js/components/ModalDialogContainer";
import TreeView, {getSelectedLeaves} from 'etna-js/components/TreeView';
import SelectInput from "../inputs/select_input";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function QueryBuilder({ display_attributes, setFilterString, selectedModel, attribute_names, setShowAdvanced }) {
  const { openModal } = useModal();
  const [filtersState, setFiltersState] = useState([]);

  useEffect(() => {
    setFiltersState([]);
  }, [selectedModel]);

  useEffect(() => {
    setFiltersState(filtersState.filter(({attribute}) => attribute_names.includes(attribute)));
  }, [attribute_names]);

  useEffect(() => {
    setFilterString(filtersState.map(({attribute, operator, operand}) => {
      switch (operator) {
        case 'Greater than':
          operator = '>';
          break;
        case 'Less than':
          operator = '<';
          break;
        case 'Equals':
          operator = '=';
          break;
        case 'Contains':
          operand = `.*${escapeRegExp(operand)}.*`;
          operator = '~';
          break;
        case 'Starts with':
          operand = `${escapeRegExp(operand)}.*`;
          operator = '~';
          break;
        case 'Ends with':
          operand = `.*${escapeRegExp(operand)}`;
          operator = '~';
          break;
      }

      return `${attribute}${operator}${operand}`;
    }).join(" "))
  }, [setFilterString, filtersState]);

  const onOpenAttributeFilter = () => {
    openModal(<FilterAttributesModal display_attributes={display_attributes} selectedModel={selectedModel} />);
  };

  const onOpenFilters = () => {
    openModal(<QueryFilterModal display_attributes={display_attributes} 
                                filtersState={filtersState} 
                                setFiltersState={setFiltersState} />);
  };

  const columnsText = attribute_names.length === display_attributes.length ? '' : `(${attribute_names.length} / ${display_attributes.length})`;
  const filtersText = filtersState.length === 0 ? '' : `${filtersState.length} filters`;

  return <div className='query-builder'>
    <a className='pointer' onClick={onOpenAttributeFilter}>
      Add/Remove Columns { columnsText }
    </a>
    <a className='pointer' onClick={onOpenFilters}>
      Add/Remove Filters { filtersText }
    </a>
    <a className='pointer' onClick={() => setShowAdvanced(true)}>
      Advanced Searched
    </a>
  </div>;
}

function disabledAttributeForProject(projectName, modelName) {
  return ([name, type]) => type === 'identifier' || type === 'parent'
}

function FilterAttributesModal({ setSearchAttributeNames, display_attributes, attributeNames, attributeNamesAndTypes, selectedModel }) {
  const displayAttributeOptions = [['All', display_attributes.map(e => [e])]];
  const { dismissModal } = useModal();
  const [selectedState, setSelectedState] = useState(() => attributeNamesToSelected(attributeNames));

  const disabledAttributeNames = useMemo(() => {
    return attributeNamesAndTypes
      .filter(disabledAttributeForProject(TIMUR_CONFIG.project_name, selectedModel))
      .map(([name]) => name);
  }, [attributeNamesAndTypes]);

  function onOk() {
    setSearchAttributeNames(getSelectedLeaves(selectedState));
    dismissModal();
  }

  return (
    <div className='search-attribute-filters-modal'>
      <TreeView
        flowHorizontally={true}
        selected={selectedState}
        disabled={attributeNamesToDisabled(disabledAttributeNames)}
        options={displayAttributeOptions}
        onSelectionsChange={setSelectedState}
      />
      <div className='actions'>
        <button onClick={onOk} disabled={attributeNames.length === 0}>Ok</button>
      </div>
    </div>
  );
}

FilterAttributesModal = connect(
  (state) => ({
    attributeNames: selectSortedAttributeNames(state),
    attributeNamesAndTypes: selectDisplayAttributeNamesAndTypes(state),
  }),
  { setSearchAttributeNames, }
)(FilterAttributesModal);

const operators = [
  'Less than',
  'Greater than',
  'Equals',
  'Contains',
  'Starts with',
  'Ends with',
];

const defaultFilterRowState = {
  attribute: '',
  operator: operators[0],
  operand: '',
}

function QueryFilterModal({
  attribute_names,
  filtersState: initialFiltersState,
  setFiltersState: updateParentFiltersState
}) {
  const { dismissModal } = useModal();
  let [filtersState, setLocalFiltersState] = useState(initialFiltersState);

  function setFiltersState(state) {
    setLocalFiltersState(state);
    updateParentFiltersState(state);
  }

  function FiltersStateHandler(rowAttribute) {
    return function (idx) {
      return function (value, evt) {
        if (!value) {
          filtersState = [...filtersState];
          filtersState.splice(idx, 1);
        } else {
          if (idx === -1) {
            filtersState = [...filtersState, { ...defaultFilterRowState, [rowAttribute]: value }];
          } else {
            filtersState = [...filtersState];
            filtersState.splice(idx, 1, { ...filtersState[idx], [rowAttribute]: value });
          }
        }
        setFiltersState(filtersState);
      }
    }
  }

  const onFilterAttributeChange = FiltersStateHandler('attribute');
  const onFilterOperandChange = FiltersStateHandler('operand');
  const onFilterOperatorChange = FiltersStateHandler('operator');

  return (
    <div className='search-filters-modal'>
      {filtersState.map(({attribute, operator, operand}, idx) => <div className='filters' key={idx}>
        <SelectInput
          values={attribute_names}
          defaultValue={attribute}
          onChange={onFilterAttributeChange(idx)}
          showNone='enabled'
          className='filter attribute'
        />

        <SelectInput
          values={operators}
          defaultValue={operator}
          onChange={onFilterOperatorChange(idx)}
          showNone='enabled'
          className='filter operator'
        />

        <input
          type='text'
          className='filter operand'
          defaultValue={operand}
          onBlur={(e) => onFilterOperandChange(idx)(e.target.value)}
        />

        <a className='pointer' onClick={() => onFilterOperandChange(idx)('')}>
          X
        </a>
      </div>)}
      <div>
        New Filter On <SelectInput
          name='model'
          values={attribute_names}
          value=''
          showNone='enabled'
          onChange={onFilterAttributeChange(-1)}
        />
      </div>
      <div className='actions'>
        <button onClick={dismissModal}>Ok</button>
      </div>
    </div>
  );
}

QueryFilterModal = connect(
  (state) => ({ attribute_names: selectSortedAttributeNames(state), }),
)(QueryFilterModal);

function attributeNamesToSelected(attributeNames) {
  if (attributeNames === 'all') return null;
  return { All: attributeNames.reduce((o, p) => (o[p] = true, o), {}) };
}

function attributeNamesToDisabled(attributeNames) {
  return { All: attributeNames.reduce((o, p) => (o[p] = true, o), {}) };
}

export default connect(
  (state) => ({ attribute_names: selectSortedAttributeNames(state), }),
  {
    setFilterString,
  }
)(QueryBuilder);
