// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ListMenu from '../list_menu';
import ManifestView from './manifest_view';

// Module imports.
import * as ManifestActions from '../../actions/manifest_actions';
import * as ManifestSelector from '../../selectors/manifest_selector';

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
  }

  render(){
    let {
      sections,
      selected_manifest,
      is_admin,
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
      is_admin: is_admin
    };

    return(
      <div className='manifest-group'>

        <div className='left-column-group'>

          <ListMenu {...list_menu_props} />
        </div>
        <div className='right-column-group'>

          {(selected_manifest) ? <ManifestView {...manifest_props} /> : ''}
        </div>
      </div>
    );
  }
}

const accessFilter = (access, manifests)=>{
  return manifests.filter(m => m.access == access).sort((a,b) => a > b);
};

const mapStateToProps = (state = {}, own_props)=>{
  let manifests = ManifestSelector.getAllManifests(state);
  let sections = {
    Public: accessFilter('public', manifests),
    Private: accessFilter('private', manifests)
  };

  return {
    sections,
    selected_manifest: ManifestSelector.getSelectedManifest(state)
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestManifests: ()=>{
      dispatch(ManifestActions.requestManifests());
    },

    selectManifest: (id)=>{
      dispatch({
        type: 'SELECT_MANIFEST',
        id
      });
    }
  };
};

export const ManifestsContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Manifests);
