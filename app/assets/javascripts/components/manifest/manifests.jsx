// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ListMenu from '../list_menu';
import ManifestView from './manifest_view';

// Module imports.
import {requestManifests} from '../../actions/manifest_actions';
import {getSelectedManifest, getAllManifests} from '../../selectors/manifest';

// Main component for viewing/editing manifests.
export class Manifests extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.props.requestManifests();
  }

  create(){
    // A manifest with an id of '0' is a new manifest.
    this.props.selectManifest(0);

    if(this.props.is_editing) return;
    this.props.toggleEdit();
  }

  render(){
    let {
      sections,
      selected_manifest,
      is_admin,
      is_editing,
      component_name
    } = this.props;

    let list_menu_props = {
      name: 'Manifest',
      create: this.create.bind(this),
      select: this.props.selectManifest,
      sections: sections
    };

    let manifest_props = {
      manifest: selected_manifest,
      is_admin: is_admin,
      is_editing: is_editing
    };

    return(
      <div className='manifest-group'>

        <div className='left-column-group'>

          <ListMenu {...list_menu_props} />
        </div>
        <div className='right-column-group'>

          {(selected_manifest || is_editing) ? <ManifestView {...manifest_props} /> : ''}
        </div>
      </div>
    );
  }
}

const accessFilter = (access, manifests)=>{
  return manifests.filter(m => m.access == access).sort((a,b) => a > b);
};

const mapStateToProps = (state = {}, own_props)=>{
  let {manifestsUI: {isEditing}} = state;
  let manifests = getAllManifests(state);

  let sections = {
    Public: accessFilter('public', manifests),
    Private: accessFilter('private', manifests)
  };

  return {
    sections,
    selected_manifest: getSelectedManifest(state),
    is_editing: isEditing
  }
}

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestManifests: ()=>{
      dispatch(requestManifests());
    },

    selectManifest: (id)=>{
      dispatch({
        type: 'SELECT_MANIFEST',
        id
      });
    },

    toggleEdit: ()=>{
      dispatch({
        type: 'TOGGLE_IS_EDITING_MANIFEST'
      });
    },
  };
};

export const ManifestsContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Manifests);
