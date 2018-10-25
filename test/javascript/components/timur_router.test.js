import React from 'react';
import { shallow, mount } from 'enzyme';
import TimurRouter from '../../../lib/client/jsx/timur_router';
import { mockStore } from '../helpers';

class mockBrowser extends React.Component {
  render() {
    let {project_name, model_name, record_name} = this.props;
    return <div className='browser'>
      <span className='project_name'>{ project_name }</span>
      <span className='model_name'>{ model_name }</span>
      <span className='record_name'>{ record_name }</span>
    </div>;
  }
};

jest.mock('../../../lib/client/jsx/components/browser/browser',
  () => 'mock-browser'
);
jest.mock('../../../lib/client/jsx/components/timur_nav',
  () => function() {
    return <div className='timur-nav'/>;
  }
);
jest.mock('../../../lib/client/jsx/components/messages',
  () => function() {
    return <div className='messages'/>;
  }
);

describe('TimurRouter', () => {
  it('displays the component for a matching route', () => {
    const store=mockStore({
      location: '/labors/browse/monster/Nemean Lion'
    });

    let component = mount(
      <TimurRouter store={store}/>
    );

    let p = component.find('mock-browser').first();
    expect(p.prop('project_name')).toEqual('labors');
    expect(p.prop('model_name')).toEqual('monster');
    expect(p.prop('record_name')).toEqual('Nemean Lion');
  });

  it('shows a message for an unknown route', () => {
    const store=mockStore({
      location: '/silly/route/nomatch'
    });

    let component = mount(
      <TimurRouter store={store}/>
    );
    expect(store.getActions()).toEqual([
      {
        messages: [ "### You have lost your way: Path Invalid." ],
        type: "SHOW_MESSAGES"
      }
    ]);
  });
})
