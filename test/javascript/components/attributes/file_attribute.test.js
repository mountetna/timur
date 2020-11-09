import React from 'react';
import {Provider} from 'react-redux';
import {mount, shallow} from 'enzyme';
import {act} from 'react-dom/test-utils';
import {mockStore} from '../../helpers';
import renderer from 'react-test-renderer';
import ReactModal from 'react-modal';
import nock from 'nock';

import ButtonBar from '../../../../lib/client/jsx/components/button_bar';
import {STUB} from '../../../../lib/client/jsx/components/attributes/file_attribute';
import FileAttribute from '../../../../lib/client/jsx/components/attributes/file_attribute';

import ListUpload from 'etna-js/upload/components/list-upload';

describe('FileAttribute', () => {
  let store;

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

  it('renders the button bar while editing', () => {
    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={null}
          mode='edit'
          attribute='gravatar'
          document='Timur'
          revised_value=''
        />
      </Provider>
    );

    const buttons = component.find(ButtonBar);
    expect(buttons.exists()).toBeTruthy();

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileAttribute
            model_name='conquests'
            record_name='Persia'
            template={null}
            value={null}
            mode='edit'
            attribute='gravatar'
            document='Timur'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('does not render action buttons while not editing', () => {
    const value = null;

    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={value}
          mode='view'
          attribute='gravatar'
          document='Timur'
          revised_value=''
        />
      </Provider>
    );

    const buttons = component.find('file-buttons');
    expect(buttons.exists()).toBeFalsy();

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileAttribute
            model_name='conquests'
            record_name='Persia'
            template={null}
            value={value}
            mode='view'
            attribute='gravatar'
            document='Timur'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders blank paths correctly while not editing', () => {
    let value = {path: '::blank'};

    let component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={value}
          mode='view'
          attribute='gravatar'
          document='Timur'
          revised_value=''
        />
      </Provider>
    );

    expect(component.text().trim()).toEqual('Blank file');

    value = '::blank';

    component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={value}
          mode='view'
          attribute='gravatar'
          document='Timur'
          revised_value=''
        />
      </Provider>
    );

    expect(component.text().trim()).toEqual('Blank file');

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileAttribute
            model_name='conquests'
            record_name='Persia'
            template={null}
            value={value}
            mode='view'
            attribute='gravatar'
            document='Timur'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders "missing file" correctly while not editing', () => {
    const value = null;

    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={value}
          mode='view'
          attribute='gravatar'
          document='Timur'
          revised_value
        />
      </Provider>
    );

    expect(component.text().trim()).toEqual('No file');

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileAttribute
            model_name='conquests'
            record_name='Persia'
            template={null}
            value={value}
            mode='view'
            attribute='gravatar'
            document='Timur'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders existing files correctly when not editing', () => {
    const value = new File(
      ['Believe me, you are but pismire ant:'],
      'conquest.txt',
      {type: 'text/plain'}
    );

    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={value}
          mode='view'
          attribute='gravatar'
          document='Timur'
          revised_value=''
        />
      </Provider>
    );

    expect(component.text().trim()).toEqual('conquest.txt (text/plain)');

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileAttribute
            model_name='conquests'
            record_name='Persia'
            template={null}
            value={value}
            mode='view'
            attribute='gravatar'
            document='Timur'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders previous value before upload starts', () => {
    store = mockStore({
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      },
      directory: {
        uploads: {}
      }
    });

    const value = {
      path: 'previous-file-value.txt'
    };

    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={value}
          mode='view'
          attribute='gravatar'
          document='Timur'
          revised_value={value}
        />
      </Provider>
    );

    component.setProps({
      value: {
        path:
          'https://metis.test/labors/upload/temporary-path?X-Etna-Signature=foo'
      },
      revised_value: {
        path:
          'https://metis.test/labors/upload/temporary-path?X-Etna-Signature=foo'
      }
    });
    component.update();

    expect(component.text().trim()).toEqual('previous-file-value.txt');

    const uploadControls = component.find(ListUpload);
    expect(uploadControls.exists()).toBeFalsy();
  });

  it('renders upload meter and controls when uploading', () => {
    store = mockStore({
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      },
      directory: {
        uploads: {
          'temporary-file-location': {
            file_name: 'temporary-file-location',
            original_filename: 'stats.txt',
            model_name: 'conquests',
            record_name: 'Persia',
            attribute_name: 'gravatar',
            upload_speeds: [0, 10, 20, 30],
            status: 'active'
          }
        }
      }
    });

    const value = {
      path:
        'https://metis.test/labors/upload/temporary-file-location?X-Etna-Signture=hercules'
    };

    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={value}
          mode='view'
          attribute={{
            attribute_name: 'gravatar'
          }}
          document='Timur'
          revised_value={value}
        />
      </Provider>
    );

    const uploadControls = component.find(ListUpload);
    expect(uploadControls.exists()).toBeTruthy();

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileAttribute
            model_name='conquests'
            record_name='Persia'
            template={null}
            value={value}
            mode='view'
            attribute={{
              attribute_name: 'gravatar'
            }}
            document='Timur'
            revised_value={value}
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders previous file path value if upload cancelled', () => {
    const upload = {
      file_name: 'temporary-file-location',
      original_filename: 'stats.txt',
      model_name: 'conquests',
      record_name: 'Persia',
      attribute_name: 'gravatar',
      upload_speeds: [0, 10, 20, 30],
      status: 'paused'
    };

    let state = {
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      },
      directory: {
        uploads: {
          'temporary-file-location': upload
        }
      }
    };

    store = mockStore(() => state);

    const value = {
      path: 'previous-file-value.txt'
    };

    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={value}
          mode='view'
          attribute={{
            attribute_name: 'gravatar'
          }}
          document='Timur'
          revised_value=''
        />
      </Provider>
    );

    component.setProps({
      value: {
        path:
          'https://metis.test/labors/upload/temporary-file-location?X-Etna-Signature=foo'
      },
      revised_value: {
        path:
          'https://metis.test/labors/upload/temporary-file-location?X-Etna-Signature=foo'
      }
    });
    component.update();

    expect(component.text().trim()).not.toEqual('previous-file-value.txt');
    let uploadControls = component.find(ListUpload);
    expect(uploadControls.exists()).toBeTruthy();

    // Ideally we could test just by clicking on the Cancel button.
    //    But that goes through the service workers, which aren't
    //    really supported in test environments yet?
    // So instead this is a hack, just update store directly.
    state = {
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      },
      directory: {
        uploads: {}
      }
    };
    // Trigger state change.
    act(() => {
      store.dispatch({type: 'CANCEL_UPLOAD', upload});
    });

    component.update();

    expect(component.text().trim()).toEqual('previous-file-value.txt');

    uploadControls = component.find(ListUpload);
    expect(uploadControls.exists()).toBeFalsy();
  });

  it('sends revisions to Magma when upload completes', () => {
    const magmaMock = nock('https://magma.test')
      .post('/update')
      .reply(200, {
        models: {
          conquest: {
            template: {
              attributes: {
                gravatar: {
                  attribute_type: 'image'
                }
              }
            },
            documents: {
              Persia: {
                gravatar: {
                  path: 'https://metis.test/timur/persia/file.txt'
                }
              }
            }
          }
        }
      });

    const uploadUrl =
      'https://metis.test/timur/upload/tmp/temporary-file-location?X-Etna-Signature=foo';

    let state = {
      location: {
        path: '/timur/browse/conquest/Persia'
      },
      directory: {
        uploads: {
          'temporary-file-location': {
            file_name: 'temporary-file-location',
            original_filename: 'stats.txt',
            model_name: 'conquest',
            record_name: 'Persia',
            attribute_name: 'gravatar',
            upload_speeds: [0, 10, 20, 30],
            status: 'complete',
            url: uploadUrl
          }
        }
      }
    };

    store = mockStore(() => state);

    const value = {
      path: uploadUrl
    };

    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquest'
          record_name='Persia'
          template={null}
          value={value}
          mode='view'
          attribute={{
            attribute_name: 'gravatar'
          }}
          document='Timur'
          revised_value={null}
        />
      </Provider>
    );

    // Make sure that Magma /update is called
    magmaMock.isDone();
  });

  it('accepts a valid Metis path', () => {
    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={{name: 'Conquests', identifier: 1}}
          value={null}
          mode='edit'
          attribute={{name: 'ExpansionPlans'}}
          document={{'1': 'Timur'}}
          revised_value=''
        />
      </Provider>
    );

    const cloudButton = component.find('.cloud').first();
    cloudButton.simulate('click');

    let modal = component.find(ReactModal);
    const metisPathInput = modal.find('.file-metis-select').find('input');
    metisPathInput.instance().value = 'metis://project/bucket/file_name.txt';

    const checkButton = modal.find('.check').first();
    checkButton.simulate('click');

    // refresh the modal contents
    modal = component.find(ReactModal);
    expect(modal.find('file-metis-error').exists()).toBeFalsy();

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: 'REVISE_DOCUMENT',
        model_name: 'Conquests',
        record_name: 'Timur',
        revision: {
          ['ExpansionPlans']: {path: 'metis://project/bucket/file_name.txt'}
        }
      }
    ]);
  });

  it('shows an error message when given an invalid Metis path', () => {
    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={{name: 'Conquests', identifier: 1}}
          value={null}
          mode='edit'
          attribute={{name: 'ExpansionPlans'}}
          document={{'1': 'Timur'}}
          revised_value=''
        />
      </Provider>
    );

    const cloudButton = component.find('.cloud').first();
    cloudButton.simulate('click');

    let modal = component.find(ReactModal);
    const metisPathInput = modal.find('.file-metis-select').find('input');
    metisPathInput.instance().value = 'project/bucket/file_name.txt';

    const checkButton = modal.find('.check').first();
    checkButton.simulate('click');

    // refresh the modal contents
    modal = component.find(ReactModal);

    expect(modal.find('.file-metis-error').exists()).toBeTruthy();

    const actions = store.getActions();
    expect(actions).toEqual([]);
  });

  it('dispatches an action to mark a file as blank', () => {
    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={{name: 'Conquests', identifier: 1}}
          value={null}
          mode='edit'
          attribute={{name: 'ExpansionPlans'}}
          document={{'1': 'Timur'}}
          revised_value=''
        />
      </Provider>
    );

    const stubButton = component.find('.stub').first();
    stubButton.simulate('click');

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: 'REVISE_DOCUMENT',
        model_name: 'Conquests',
        record_name: 'Timur',
        revision: {
          ['ExpansionPlans']: {path: STUB}
        }
      }
    ]);
  });

  it('dispatches an action to remove a file', () => {
    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={{name: 'Conquests', identifier: 1}}
          value={null}
          mode='edit'
          attribute={{name: 'ExpansionPlans'}}
          document={{'1': 'Timur'}}
          revised_value=''
        />
      </Provider>
    );

    const removeButton = component.find('.remove').first();
    removeButton.simulate('click');

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: 'REVISE_DOCUMENT',
        model_name: 'Conquests',
        record_name: 'Timur',
        revision: {
          ['ExpansionPlans']: {path: null}
        }
      }
    ]);
  });

  // TODO: test for dispatching action when file uploaded
  //   * This has to talk to both Metis and Magma, so a little more
  //      involved.
});
