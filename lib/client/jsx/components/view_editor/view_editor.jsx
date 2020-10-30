import React, {useState, useEffect} from 'react';
import { useSelector, connect } from 'react-redux';
import { pushLocation } from '../../actions/location_actions';
import md5 from 'md5';
import {
    requestViews, saveNewView, copyView, saveView,
    deleteView,
} from '../../actions/view_actions';
import ViewScript from './views_script';
import { getAllViews } from '../../selectors/view_selector';
import { MD5 } from '../../selectors/consignment_selector';
/*
const AvailableViews = (props) => {
    const [view, setView] = useState({
        script: '',
        md5: ''
    });

    const handleChange = (e) => {
        setView(prev => ({...prev, [e.target.script] : e.target.value ,
        [e.target.md5] : md5(e.target.value)}));
    };
    console.log(view);

};


 */
// Main component for viewing/editing views.
function ViewEditor() {
    //let view = useSelector(state => state.view);
    const [view, setView] = useState({
        script: '',
        md5: ''
    });

    const handleChange = (e) => {
        setView(prev => ({...prev, [e.target.script] : e.target.value ,
            [e.target.md5] : md5(e.target.value)}));
    };
    console.log(view);

    let new_md5sum;
/*
    const handleChange = (view_field, event) => {
        if (view_field === 'script') {
            new_md5sum = MD5(view.script);
        } else {
            view[view_field] = event.target.value;
        }
    };

 */
    const [editing, setEditing] = useState(true);
    //const updatedField = handleChange('script', view, md5sum);

    return(
        <div>
            <ViewScript
                script={view && view.script}
                is_editing={editing}
                onChange={ e => handleChange(e) }/>
        </div>
    );
}
export default ViewEditor;

