import React, {useState, useEffect} from 'react';
import { useSelector, connect } from 'react-redux';

import DocumentWindow from '../document/document_window';
//import ManifestScript from './manifest_script';
//import ConsignmentView from './consignment_view';
import {
    applyView, requestViews
} from '../../actions/view_actions';
import { pushLocation } from '../../actions/location_actions';
import { getAllManifests } from '../../selectors/manifest_selector';
import { selectConsignment, MD5 } from '../../selectors/consignment_selector';

// Main component for viewing/editing views.
function ViewEditor() {

}
export default ViewEditor;

