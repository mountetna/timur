import React, {useState, useEffect} from 'react';
import { useSelector, connect } from 'react-redux';

import {
    requestViews, saveNewView, copyView, saveView,
    deleteView,
} from '../../actions/view_actions';
import { pushLocation } from '../../actions/location_actions';
import { getAllViews } from '../../selectors/view_selector';
import { MD5 } from '../../selectors/consignment_selector';

import {
    copyManifest, deleteManifest,
    requestConsignments,
    requestManifests,
    saveManifest,
    saveNewManifest
} from '../../actions/manifest_actions';

// Main component for viewing/editing views.
/*
function ViewEditor(props) {
    const [editing, setEditing] = useState(false)
    useEffect(()=>requestViews())

}
export default ViewEditor;
 */



// Main component for viewing/editing views.
class ViewEditor extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
        };
    }

    componentDidMount(){
        // load all views for the selector
        this.props.requestViews();
    }

    componentDidUpdate() {
        let { view_id, views } = this.props;
        let { view } = this.state;

        if (view_id && views && !view) this.selectView(view_id, false);
    }

    create() {
        this.selectView('new', true);
    }

    setView(view) {
        this.selectView(view.id);
    }

    selectView(id, push=true) {
        let { views, pushLocation } = this.props;
        let view;

        switch(id) {
            case 'new':
                let date = new Date;
                view = {
                    id: 0,
                    access: 'private',
                    name: '',
                    description: '',
                    script: '',
                    created_at: date.toString(),
                    updated_at: date.toString()
                }
                break;
            case null:
                view = null;
                break;
            default:
                // find it in the existing views
                view = views && views.find(m=>m.id ===id);
                if (!views) return;

                // copy it so you don't modify the store
                view = { ...views };
                break;
        }

        this.setState({
            view,
            md5sum: view ? MD5(view.script) : null,
            editing: id === 'new'
        });

        if (push) pushLocation(
            id == null ?
                Routes.view_path(TIMUR_CONFIG.project_name) :
                Routes.view_path(TIMUR_CONFIG.project_name, id)
        );
    }

    updateField(field_name){
        return (event)=>{
            let { view, md5sum } = this.state;
            let new_md5sum;

            if (field_name === 'script') {
                // the code editor does not emit an event, just the new value
                view.script = event;
                new_md5sum = MD5(view.script);
            } else {
                view[field_name] = event.target.value;
            }
            this.setState({view, md5sum: new_md5sum || md5sum});
        }
    }

    saveView() {
        let { view, editing } = this.state;
        // A new view should have an id set to 0.
        if(view.id <= 0)
            this.props.saveNewView(view, this.setView.bind(this));
        else
            this.props.saveView(view);

        if (editing) this.toggleEdit();
    }

    copyView() {
        let { view } = this.state;
        this.props.copyView(view, this.setView.bind(this));
    }

    deleteView() {
        let { view } = this.state;
        if(confirm('Are you sure you want to remove this view?')){
            this.props.deleteView(view, () => this.selectView(0));
        }
    }

    revertView() {
        let { view: { id }, editing } = this.state;

        if (id > 0) this.selectView(id);
        else this.selectView(null);

        if (editing) this.toggleEdit();
    }

    toggleEdit(){
        this.setState({
            editing: (!this.state.editing)
        });
    }

    render(){
        let { views, is_admin, component_name } = this.props;
        let { view, md5sum, editing } = this.state;

        return(
            <ViewScript
                script={view && view.script}
                is_editing={editing}
                onChange={ this.updateField.bind(this)('script') }/>
        );
    }
}

export default connect(
    // map state
    (state)=>({
        views: getAllViews(state)
    }),
    // map dispatch
    {
        requestViews, saveNewView, saveView, copyView, deleteView, pushLocation
    }
)(ViewEditor);