// Proprietary material of ECMC Group.  Used with permission.  No further use authorized.

import dotProp from 'dot-prop-immutable';

export const defaultState = {
  skillsState: {},
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'REHYDRATE_USER_STATE_FROM_SERVER':
      if (action.payload.s_state &&
        Object.keys(action.payload.s_state).length !== 0) {
        return {
          ...state,
          skillsState: {
            ...action.payload.s_state,
          },
        };
      }
      return { ...state };
    case 'UPDATE_HEX_VALUE': {
      return dotProp.set(
        state,
        `skillsState.${action.payload.index}.value`,
        ((action.payload.value + 1) % 3),
      );
    }
    case 'RESET_ALL_HEX_VALUES': {
      return {
        ...state,
        skillsState: Object.entries(state.skillsState).reduce(
          (newSkills, [id, skill]) => ({
            ...newSkills,
            [id]: { ...skill, value: null },
          }),
          {},
        ),
      };
    }
    default:
      return { ...state }; // TODO: add error handling
  }
}
