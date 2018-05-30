// Proprietary material of ECMC Group.  Used with permission.  No further use authorized.

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import {
  MemoryRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import ReactModal from 'react-modal';
import SkillProfilerPageConnect from '../components/SkillProfilerPage/SkillProfilerPage'; // eslint-disable-line max-len
import getSkillProfiler from '../__mocks__/getSkillProfiler';

function getJSXWithRouter(storeDefault = getSkillProfiler()) {
  const mockStore = configureStore()(storeDefault);
  const skillProfilerPageJSX = (
    <Provider store={mockStore}>
      <Router>
        <Route
          render={() => (
            <SkillProfilerPageConnect />
          )}
        />
      </Router>
    </Provider>
  );
  return { skillProfilerPageJSX, mockStore };
}

describe('SkillsProfilerPage', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const { skillProfilerPageJSX } = getJSXWithRouter();
    ReactDOM.render(skillProfilerPageJSX, div);
  });

  it('renders the SkillProfilerPage', () => {
    const { skillProfilerPageJSX } = getJSXWithRouter();
    const app = renderer.create(skillProfilerPageJSX);
    expect(app).toMatchSnapshot();
  });

  it('renders the Hex when the Hex hasn\'t yet been clicked and has no value', () => {
    const mockStore = configureStore()(getSkillProfiler());
    const skillProfiler = shallow(<SkillProfilerPageConnect store={mockStore} />).dive();
    expect(skillProfiler.find('Connect(Hex)').props()).toMatchObject({
      id: '1',
      children: 'testSkill1',
      value: null,
    });
  });

  it('renders the Hex when given an explicit value', () => {
    const SkillProfile = getSkillProfiler();
    SkillProfile.skillProfiler.skillsState[1].value = 2;
    const mockStore = configureStore()(SkillProfile);
    const skillProfiler = shallow(<SkillProfilerPageConnect store={mockStore} />).dive();
    expect(skillProfiler.find('Connect(Hex)').props()).toMatchObject({
      id: '1',
      children: 'testSkill1',
      value: 2,
    });
  });

  it(`has a reset button that when clicked fires
   RESET_ALL_HEX_VALUES and PUT_PROFILE_STATE_REQUESTED`, () => {
      const { skillProfilerPageJSX, mockStore } = getJSXWithRouter();
      const skillProfiler = mount(skillProfilerPageJSX);
      mockStore.clearActions();
      const resetButton = skillProfiler.find('.reset-button');
      resetButton.simulate('click');
      expect(mockStore.getActions()).toEqual(
        [{ type: 'RESET_ALL_HEX_VALUES' }, { type: 'PUT_PROFILE_STATE_REQUESTED' }],
      );
    });

  it('sets showModal state to false when handleCloseModal is called', () => {
    const { skillProfilerPageJSX } = getJSXWithRouter();
    const skillProfiler = mount(skillProfilerPageJSX);
    skillProfiler.find('.text-container').simulate('click');
    expect(skillProfiler.find(ReactModal).prop('isOpen')).toEqual(true);
    skillProfiler.find('SkillProfilerPage').instance().handleCloseModal();
    expect(skillProfiler.find('SkillProfilerPage').instance().state.showModal).toBe(false);
  });

  describe('when next button is clicked and interests are not all completed', () => {
    let skillProfile;
    beforeEach(() => {
      const { skillProfilerPageJSX } = getJSXWithRouter();
      skillProfile = mount(skillProfilerPageJSX);
    });

    it('opens modal', () => {
      skillProfile.find('.text-container').simulate('click');
      expect(skillProfile.find(ReactModal).prop('isOpen')).toEqual(true);
    });

    it('does not fire fetchSubmitBarValues', () => {
      const mockStore = configureStore()(getSkillProfiler());
      mockStore.clearActions();
      skillProfile.find('.arrow-container').simulate('click');
      expect(mockStore.getActions())
        .toEqual([],
      );
    });
  });

  describe('when next button is clicked and interests are all completed', () => {
    let skillProfile;
    let mockStore;
    beforeEach(() => {
      const skillsStore = getSkillProfiler();
      skillsStore.skillProfiler.skillsState[1].value = 2;
      const skillProfilerObject = getJSXWithRouter(skillsStore);
      skillProfile = mount(skillProfilerObject.skillProfilerPageJSX);
      mockStore = skillProfilerObject.mockStore;
    });

    it('does not open modal', () => {
      skillProfile.find('.text-container').simulate('click');
      expect(skillProfile.find(ReactModal).prop('isOpen')).toEqual(false);
    });

    it('has a link that goes to /results', () => {
      const link = skillProfile.find(Link);
      expect(link.length).toBe(1);
      expect(link.props().to).toBe('/results');
    });

    it('fires updateHexValues', () => {
      skillProfile.find(Link).simulate('click');
      expect(mockStore.getActions())
        .toContainEqual(
          {
            payload: {
              calculate: true,
              index: 1,
              value: 2,
            },
            type: 'UPDATE_HEX_VALUE',
          },
      );
    });
  });
});
