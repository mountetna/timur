import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {connect} from "react-redux";
import {
  selectDisplayAttributeNamesAndTypes,
  selectSearchShowDisconnected,
  selectSortedAttributeNames,
  selectSearchExpandMatrices
} from "../../selectors/search";
import {
  setFilterString,
  setShowDisconnected,
  setSearchAttributeNames,
  setOutputPredicate,
  setExpandMatrices
} from "../../actions/search_actions";
import {useModal} from "etna-js/components/ModalDialogContainer";
import {useReduxState} from 'etna-js/hooks/useReduxState';
import TreeView, {getSelectedLeaves} from 'etna-js/components/TreeView';
import SelectInput from "etna-js/components/inputs/select_input";
import {selectIsEditor} from 'etna-js/selectors/user-selector';
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function QueryBuilder({
  display_attributes,
  setFilterString,
  selectedModel,
  attribute_names,
  setShowAdvanced,
  setOutputPredicate,
  magma_state }) {

  const { openModal } = useModal();
  const [filtersState, setFiltersState] = useState([]);
  const show_disconnected = useReduxState(state => selectSearchShowDisconnected(state));

  useEffect(() => {
    setFiltersState([]);
  }, [selectedModel]);

  useEffect(() => {
    setFiltersState(filtersState.filter(({attribute}) => attribute_names.includes(attribute)));
  }, [attribute_names]);

  useEffect(() => {
    // Matrix filters need to also be translated into output_predicates, too,
    //   because in Magma they have to be sliced after leaving the
    //   database. We leave them as input filters so that only records
    //   with matrix data are returned.
    let outputPredicates = filtersState.filter(({attribute}) => {
      if (!attribute) return false;
      let template = magma_state.models[selectedModel].template;      

      return "matrix" === template.attributes[attribute].attribute_type;
    });
    
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
        case 'In':
          operator = '[]';
          break;
        case 'Is null':
          operand = null;
          operator = '^@';
          break;
      }

      return `${attribute}${operator}${operand}`;
    }))
    
    if (outputPredicates) {
      // Set any matrix attributes to slices
      setOutputPredicate(outputPredicates.map(({attribute, operator, operand}) => {
        switch (operator) {
          case 'In':
            operator = '[]';
            break;
        }

        return `${attribute}${operator}${operand}`;
      }))
    }
  }, [setFilterString, setOutputPredicate, filtersState]);

  const onOpenAttributeFilter = () => {
    openModal(<FilterAttributesModal display_attributes={display_attributes} selectedModel={selectedModel} />);
  };

  const onOpenFilters = () => {
    openModal(<QueryFilterModal display_attributes={display_attributes} 
                                filtersState={filtersState} 
                                setFiltersState={setFiltersState} />);
  };

  const columnsText = attribute_names.length === display_attributes.length ? 'All' : `${attribute_names.length} / ${display_attributes.length}`;
  const filtersCount = filtersState.length + (show_disconnected ? 1 : 0);
  const filtersText = filtersCount === 0 ? 'No filters' : filtersCount === 1 ? '1 filter' : `${filtersCount} filters`;

  return <div className='query-builder'>
    <a className='pointer' onClick={onOpenAttributeFilter}>
      { columnsText } columns
    </a>
    <a className='pointer' onClick={onOpenFilters}>
      { filtersText }
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
      .filter(disabledAttributeForProject(CONFIG.project_name, selectedModel))
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
  { setSearchAttributeNames }
)(FilterAttributesModal);

const operators = [
  'Less than',
  'Greater than',
  'Equals',
  'Contains',
  'Starts with',
  'Ends with',
  'In',
  'Is null',
];

const defaultFilterRowState = {
  attribute: '',
  operator: operators[0],
  operand: '',
}

function QueryFilterModal({
  attribute_names, can_edit,
  show_disconnected, setShowDisconnected, 
  filtersState: initialFiltersState,
  setFiltersState: updateParentFiltersState,
  expand_matrices, setExpandMatrices
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

        { "Is null" !== operator ? 
          <input
            type='text'
            className='filter operand'
            defaultValue={operand}
            onBlur={(e) => onFilterOperandChange(idx)(e.target.value)}
          /> : 
          <input
            type='text'
            readOnly={true}
            className='filter operand'
            defaultValue="null"
          /> }

        <a className='pointer delete' onClick={() => onFilterOperandChange(idx)('')}>
          <i className='fas fa-times'/>
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
      <div className='tray'>
        { can_edit && 
        <React.Fragment>
          <label className='show-disconnected'>
            <input
              checked={ !!show_disconnected }
              onChange={ () => setShowDisconnected(!show_disconnected) }
              type="checkbox"/> Show only disconnected records
          </label>
          <label className='expand-matrices'>
            <input
              checked={ !!expand_matrices }
              onChange={ () => setExpandMatrices(!expand_matrices) }
              type="checkbox"/> Expand matrices in TSV
          </label>
        </React.Fragment> }
        <div className='actions'>
          <button onClick={dismissModal}>Ok</button>
        </div>
      </div>
    </div>
  );
}

QueryFilterModal = connect(
  (state) => ({ attribute_names: selectSortedAttributeNames(state),
    show_disconnected: selectSearchShowDisconnected(state),
    can_edit: selectIsEditor(state),
    expand_matrices: selectSearchExpandMatrices(state)
  }),
  { setShowDisconnected,
    setExpandMatrices }
)(QueryFilterModal);

function attributeNamesToSelected(attributeNames) {
  if (attributeNames === 'all') return null;
  return { All: attributeNames.reduce((o, p) => (o[p] = true, o), {}) };
}

function attributeNamesToDisabled(attributeNames) {
  return { All: attributeNames.reduce((o, p) => (o[p] = true, o), {}) };
}

export default connect(
  (state) => ({
    attribute_names: selectSortedAttributeNames(state),
    magma_state: state.magma
  }),
  {
    setFilterString,
    setOutputPredicate
 }
)(QueryBuilder);
