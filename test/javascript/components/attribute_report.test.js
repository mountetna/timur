import React from 'react';
import renderer from 'react-test-renderer';
import AttributeReport from '../../../lib/client/jsx/components/model_map/attribute_report';

const MONSTER = require('../fixtures/template_monster.json');

describe('AttributeReport', () => {
  it('renders', () => {
    const tree = renderer
      .create(<AttributeReport attribute={MONSTER.attributes.name} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
