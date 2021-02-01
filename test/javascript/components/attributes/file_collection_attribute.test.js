import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import ReactModal from 'react-modal';

import {mockStore} from '../../helpers';
import renderer from 'react-test-renderer';

import FileCollectionAttribute from '../../../../lib/client/jsx/components/attributes/file_collection_attribute';
import ListInput from '../../../../lib/client/jsx/components/inputs/list_input';

describe('FileCollectionAttribute', () => {
  let store;
  const template = require('../../fixtures/template_monster.json');

  beforeEach(() => {
    store = mockStore({
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      },
      directory: {
        uploads: {}
      }
    });
  });

  it('renders the ListInput while editing', () => {
    const component = mount(
      <Provider store={store}>
        <FileCollectionAttribute
          model_name='monsters'
          record_name='Nemean Lion'
          template={template}
          value={null}
          mode='edit'
          attribute='certificates'
          document='Nemean Lion'
          revised_value=''
        />
      </Provider>
    );

    const list_input = component.find(ListInput);
    expect(list_input.exists()).toBeTruthy();

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileCollectionAttribute
            model_name='monsters'
            record_name='Nemean Lion'
            template={template}
            value={null}
            mode='edit'
            attribute='certificates'
            document='Nemean Lion'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('can add file via Metis Paths', () => {
    const component = mount(
      <Provider store={store}>
        <FileCollectionAttribute
          model_name='monster'
          record_name='Nemean Lion'
          template={template}
          value={null}
          mode='edit'
          attribute={{
            name: 'certificates'
          }}
          document={{
            name: 'Nemean Lion'
          }}
          revised_value=''
        />
      </Provider>
    );

    const list_input = component.find(ListInput);
    expect(list_input.exists()).toBeTruthy();

    const addButton = component.find('.add_item').first();
    addButton.simulate('click');

    let actions = store.getActions();
    expect(actions).toEqual([
      {
        type: 'REVISE_DOCUMENT',
        model_name: 'monster',
        record_name: 'Nemean Lion',
        revision: {
          certificates: ['']
        }
      }
    ]);

    let cloudButton = component.find('.cloud').first();
    cloudButton.simulate('click');

    let modal = component.find(ReactModal);
    let metisPathInput = modal.find('.file-metis-select').find('input');
    metisPathInput.instance().value = 'metis://labors/bucket/file_name1.txt';

    let checkButton = modal.find('.check').first();
    checkButton.simulate('click');

    // refresh the modal contents
    modal = component.find(ReactModal);
    expect(modal.find('file-metis-error').exists()).toBeFalsy();

    actions = store.getActions();
    expect(actions).toEqual([
      {
        type: 'REVISE_DOCUMENT',
        model_name: 'monster',
        record_name: 'Nemean Lion',
        revision: {
          certificates: ['']
        }
      },
      {
        type: 'REVISE_DOCUMENT',
        model_name: 'monster',
        record_name: 'Nemean Lion',
        revision: {
          certificates: [
            {
              original_filename: 'file_name1.txt',
              path: 'metis://labors/bucket/file_name1.txt'
            }
          ]
        }
      }
    ]);
  });

  it('does not render action buttons while not editing', () => {
    const value = null;

    const component = mount(
      <Provider store={store}>
        <FileCollectionAttribute
          model_name='monsters'
          record_name='Nemean Lion'
          template={template}
          value={value}
          mode='view'
          attribute='certificates'
          document='Nemean Lion'
          revised_value=''
        />
      </Provider>
    );

    const list_input = component.find(ListInput);
    expect(list_input.exists()).toBeFalsy();

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileCollectionAttribute
            model_name='monsters'
            record_name='Nemean Lion'
            template={template}
            value={value}
            mode='view'
            attribute='certificates'
            document='Nemean Lion'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders existing files correctly when not editing', () => {
    const value = [
      {
        original_filename: 'test1.txt',
        url: 'https://metis.test/test/download/test1.txt?X-Etna-Signature=foo'
      },
      {
        original_filename: 'test2.png',
        url: 'https://metis.test/test/download/test2.png?X-Etna-Signature=foo'
      }
    ];

    const component = mount(
      <Provider store={store}>
        <FileCollectionAttribute
          model_name='monsters'
          record_name='Nemean Lion'
          template={template}
          value={value}
          mode='view'
          attribute='gravatar'
          document='Nemean Lion'
          revised_value=''
        />
      </Provider>
    );

    expect(component.text().trim()).toEqual('test1.txt  test2.png');

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileCollectionAttribute
            model_name='monsters'
            record_name='Nemean Lion'
            template={template}
            value={value}
            mode='view'
            attribute='gravatar'
            document='Nemean Lion'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders existing files in edit mode', () => {
    const value = [
      {
        original_filename: 'test1.txt',
        url: 'https://metis.test/test/download/test1.txt?X-Etna-Signature=foo'
      },
      {
        original_filename: 'test2.png',
        url: 'https://metis.test/test/download/test2.png?X-Etna-Signature=foo'
      }
    ];

    const component = mount(
      <Provider store={store}>
        <FileCollectionAttribute
          model_name='monsters'
          record_name='Nemean Lion'
          template={template}
          value={value}
          mode='edit'
          attribute='gravatar'
          document='Nemean Lion'
          revised_value={value}
        />
      </Provider>
    );

    expect(component.text().trim()).toEqual('test1.txttest2.png+');

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileCollectionAttribute
            model_name='monsters'
            record_name='Nemean Lion'
            template={template}
            value={value}
            mode='edit'
            attribute='gravatar'
            document='Nemean Lion'
            revised_value={value}
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('can remove existing files when editing', () => {
    const value = [
      {
        original_filename: 'test1.txt',
        url:
          'https://metis.test/labors/download/bucket/test1.txt?X-Etna-Signature=foo'
      },
      {
        original_filename: 'test2.png',
        url:
          'https://metis.test/labors/download/bucket/test2.png?X-Etna-Signature=foo'
      }
    ];

    const component = mount(
      <Provider store={store}>
        <FileCollectionAttribute
          model_name='monsters'
          record_name='Nemean Lion'
          template={template}
          value={value}
          mode='edit'
          attribute={{
            name: 'certificates'
          }}
          document={{
            name: 'Nemean Lion'
          }}
          revised_value={value}
        />
      </Provider>
    );

    const list_input = component.find(ListInput);
    expect(list_input.exists()).toBeTruthy();

    const removeFile = component.find('.delete_link').first();
    removeFile.simulate('click');

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: 'REVISE_DOCUMENT',
        model_name: 'monster',
        record_name: 'Nemean Lion',
        revision: {
          certificates: [
            {
              original_filename: 'test2.png',
              path: 'metis://labors/bucket/test2.png'
            }
          ]
        }
      }
    ]);
  });
});
