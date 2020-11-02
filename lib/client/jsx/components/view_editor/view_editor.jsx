import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pushLocation } from '../../actions/location_actions';
import {
    requestViewsAction, saveNewViewAction,
    copyViewAction, saveViewAction
} from '../../actions/view_actions';
import DocumentWindow from '../document/document_window';
import ViewScript from './views_script';
import { getAllViews } from '../../selectors/view_selector';
import MD5 from '../../selectors/consignment_selector';


// Main component for viewing/editing views.
const ViewEditor = (props) => {

    const [editing, setEditing] = useState(false);
    let [view, setView] = useState('');
    let [md5sum, setMd5sum] = useState('');
    const dispatch = useDispatch();


    // initial request for all views
    useEffect(() => {
        dispatch(requestViewsAction)();
    }, []);

    // updated view
    useEffect(() => {
        let {view_id, views} = props;
        let view = useSelector(state => state.view);
        if (view_id && views && !view) selectView(view_id, false);
    });


    const selectView = (id, push=true) => {
        let views = props;
        switch(id) {
            case 'new':
                let date = new Date;
                view = {
                    id: 0,
                    name: '',
                    description: '',
                    script: '',
                    created_at: date.toString(),
                    updated_at: date.toString()
                };
                break;
            case null:
                view = null;
                break;
            default:
                // find it in the existing views
                view = views && views.find(m => m.id === id);
                if (!view) return;

                // copy it so you don't modify the store
                view = { ...view };
                break;
        }

        setView(view);
        const md5sum = view ? MD5(view.script) : null;
        setMd5sum(md5sum);
        setEditing(id === 'new');

        if (push) dispatch(pushLocation(
            id == null ?
                Routes.views_path(TIMUR_CONFIG.project_name) :
                Routes.view_path(TIMUR_CONFIG.project_name, id)
        ));
    };

    const create = () => selectView('new', true);

    const activateView = (view) => selectView(view.id);

    const updateField = (field_name) => (event) => {
        let { view, md5sum } = useSelector(state => {state.view, state.md5sum});
        let new_md5sum;

        if (field_name === 'script') {
            // the code editor does not emit an event, just the new value
            view.script = event;
            new_md5sum = MD5(view.script);
        } else {
            view[field_name] = event.target.value;
        }
        setView(view);
        setMd5sum(new_md5sum || md5sum);
    };

    const saveView = () => {
        let { view, editing } = useSelector(state => {state.view, state.editing});
        // A new view should have an id set to 0.
        if (view.id <= 0) {
            dispatch(saveNewViewAction(view, activateView()));
        }
        else {
            dispatch(saveViewAction(view));
        }

        if (editing) toggleEdit();
    };

    const copyView = () => {
        let { view } = useSelector(state => state.view);
        dispatch(copyViewAction(view, activateView()));
    };

    const revertView = () => {
        let { view: { id }, editing } = useSelector(state => {state.view, state.editing});

        if (id > 0) selectView(id);
        else selectView(null);

        if (editing) toggleEdit();
    };

    const toggleEdit = () => {
        setEditing(!editing);
    };

    return(

        <DocumentWindow
            md5sum={ md5sum }
            documentType='view'
            editing={ dispatch(editing) }
            document={ view }
            documents={props.views}
            onCreate={create}
            onSelect={activateView}
            onUpdate={updateField}
            onEdit={toggleEdit}
            onCancel={revertView}
            onSave={saveView}
            onCopy={copyView}>>
            <ViewScript
                script={view && view.script}
                is_editing={editing}
                onChange={ updateField('script') }
            />
        </DocumentWindow>

    );
};
export default ViewEditor;


