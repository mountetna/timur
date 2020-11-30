import React from 'react';
import {Provider} from 'react-redux';
import {mount, shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import {mockStore} from '../helpers';
import HomePage from '../../../lib/client/jsx/components/home_page';

const permissions = require('../fixtures/home_page_permissions.json');
const projects = require('../fixtures/project_names.json')

describe('HomePage', () => {
  it('renders', () => {
    const tree = renderer
      .create(<HomePage permissions={permissions} projects={projects} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
