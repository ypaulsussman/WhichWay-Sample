// This code is the property of ECMC Group and is provided with permission as a work sample. 
// No further use or dissemination is authorized without express written permission of ECMC Group.

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
