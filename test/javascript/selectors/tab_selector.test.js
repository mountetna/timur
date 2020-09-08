import {interleaveAttributes} from '../../../lib/client/jsx/selectors/tab_selector';

import {sortAttributes} from '../../../lib/client/jsx/utils/attributes';

describe('interleaveAttributes', () => {
  let monster = {
    attributes: {
      name: {
        attribute_class: 'Magma::Attribute',
        type: 'String',
        name: 'name',
        attribute_name: 'name',
        attribute_type: 'identifier'
      },
      height: {
        attribute_class: 'Magma::Attribute',
        type: 'Integer',
        name: 'height',
        attribute_name: 'height',
        attribute_type: 'integer'
      },
      cry: {
        attribute_class: 'Magma::Attribute',
        type: 'String',
        name: 'cry',
        options: ['scream', 'roar', 'hiss'],
        attribute_name: 'cry',
        attribute_type: 'string'
      }
    }
  };

  it('overwrites partial pane attributes with magma attributes', () => {
    let tab = {
      panes: {
        monster: {
          attributes: {
            // this attribute is found in the magma template
            name: {},
            // here is some other attribute not present in the template
            victims: {
              attribute_class: 'VictimAttribute'
            }
          }
        }
      }
    };

    let interleaved = interleaveAttributes(tab, monster);

    expect(interleaved).toEqual({
      panes: {
        monster: {
          attributes: {
            // the magma attribute is editable
            name: {
              ...monster.attributes.name,
              editable: true
            },
            // the other is not
            victims: {
              attribute_class: 'VictimAttribute'
            }
          }
        }
      }
    });
  });
  it('fills empty pane attributes information with the template attributes', () => {
    // the pane attributes are undefined
    let tab = {
      panes: {
        monster: {attributes: {}}
      }
    };

    let interleaved = interleaveAttributes(tab, monster);

    // we get back the full list of template attributes, sorted
    expect(interleaved).toEqual({
      panes: {
        monster: {
          attributes: sortAttributes(
            Object.keys(monster.attributes).reduce((attributes, att_name) => {
              attributes[att_name] = {
                ...monster.attributes[att_name],
                editable: true
              };
              return attributes;
            }, {})
          )
        }
      }
    });
  });
});
