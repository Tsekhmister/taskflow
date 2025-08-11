import { takeLatest, put } from 'redux-saga/effects';
import { loginStart, loginFailure } from '../slices/authSlice';

function* loginSaga() {
  try {
    yield put(loginStart());
    // API call will be here
    // const user = yield call(api.login, action.payload);
    // yield put(loginSuccess(user));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    yield put(loginFailure(errorMessage));
  }
}

export default function* authSaga() {
  yield takeLatest('auth/loginStart', loginSaga);
}
