// Proprietary material of ECMC Group.  Used with permission.  No further use authorized.

import { call, put, takeEvery, select } from 'redux-saga/effects';
import axios from 'axios';

export function* putSkillValue(action) {
  try {
    const skill = yield select(
      state => state.skillProfiler.skillsState[action.payload.index],
    );
    const stateId = yield select(state => state.user.profileState.id);
    const skillProfiler = yield call(
      axios.put,
      `/profile/states/${stateId}/skills/state`,
      {
        profile_state: {
          s_state: { [action.payload.index]: skill },
          calculate: action.payload.calculate,
        },
      },
    );
    yield put({ type: 'SET_SKILL_VALUE_SUCCEEDED', payload: skillProfiler });
    if (action.payload.calculate) {
      yield put({ type: 'REHYDRATE_USER_STATE_FROM_SERVER', payload: skillProfiler.data });
    }
  } catch (error) {
    yield put({ type: 'SET_SKILL_VALUE_FAILED', payload: error.message });
  }
}

export default function* skillProfilerApiSaga() {
  yield [takeEvery('UPDATE_HEX_VALUE', putSkillValue)];
}
