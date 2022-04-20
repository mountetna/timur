import React from 'react';
import {Provider} from 'react-redux';
import {mockStore} from '../helpers';
import renderer from 'react-test-renderer';
import AttributeReport from '../../../lib/client/jsx/components/model_map/attribute_report';

const monster = require('../fixtures/template_monster.json');

describe('AttributeReport', () => {
  const store = mockStore({ });

  it('renders', () => {
    const tree = renderer
    .create(<Provider store={store}>
      <AttributeReport attribute={monster.attributes.name} />
      </Provider>)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
