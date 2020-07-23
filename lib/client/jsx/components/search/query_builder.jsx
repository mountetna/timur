import React, {useCallback, useState, useEffect} from 'react';
import {connect} from "react-redux";
import {selectSearchAttributeNames} from "../../selectors/search";
import {setFilterString, setSearchAttributeNames} from "../../actions/search_actions";
import {useModal} from "etna-js/components/ModalDialogContainer";
import TreeView, {getSelectedLeaves} from 'etna-js/components/TreeView';
import SelectInput from "../inputs/select_input";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function QueryBuilder({ display_attributes, setFilterString, selectedModel, attribute_names }) {
  const { openModal } = useModal();
  const [filtersState, setFiltersState] = useState([]);

  useEffect(() => {
    setFiltersState([]);
  }, [selectedModel]);

  useEffect(() => {
    setFiltersState(filtersState.filter(({attribute}) => attribute_names === 'all' || attribute_names.includes(attribute)));
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
    openModal(<FilterAttributesModal display_attributes={display_attributes} />);
  };

  const onOpenFilters = () => {
    openModal(<QueryFilterModal display_attributes={display_attributes} 
                                filtersState={filtersState} 
                                setFiltersState={setFiltersState} />);
  };

  return <div className='query-builder'>
    <a className='pointer' onClick={onOpenAttributeFilter}>
      Add/Remove Attributes
    </a>
    <a className='pointer' onClick={onOpenFilters}>
      Add/Remove Filters
    </a>
  </div>;
}

function FilterAttributesModal({ setSearchAttributeNames, display_attributes, attribute_names }) {
  const display_attribute_options = [['All', display_attributes.map(e => [e])]];
  const { dismissModal } = useModal();
  const handleTreeViewSelectionsChange = useCallback((new_state) => {
    setSearchAttributeNames(getSelectedLeaves(new_state));
  }, [setSearchAttributeNames]);


  return (
    <div className='search-attribute-filters-modal'>
      <TreeView
        flowHorizontally={true}
        selected={attributeNamesToSelected(attribute_names)}
        options={display_attribute_options}
        onSelectionsChange={handleTreeViewSelectionsChange}
      />
      <div className='actions'>
        <button onClick={dismissModal} disabled={attribute_names.length === 0}>Ok</button>
      </div>
    </div>
  );
}

FilterAttributesModal = connect(
  (state) => ({ attribute_names: selectSearchAttributeNames(state), }),
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
  display_attributes,
  filtersState: initialFiltersState,
  setFiltersState: updateParentFiltersState
}) {
  const { dismissModal } = useModal();
  let [filtersState, setLocalFiltersState] = useState(initialFiltersState);

  function setFiltersState(state) {
    setLocalFiltersState(state);
    updateParentFiltersState(state);
  }

  if (attribute_names === 'all') {
    attribute_names = display_attributes;
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
  (state) => ({ attribute_names: selectSearchAttributeNames(state), }),
)(QueryFilterModal);

function attributeNamesToSelected(attributeNames) {
  if (attributeNames === 'all') return null;
  return { All: attributeNames.reduce((o, p) => (o[p] = true, o), {}) };
}

export default connect(
  (state) => ({ attribute_names: selectSearchAttributeNames(state), }),
  {
    setFilterString,
  }
)(QueryBuilder);
