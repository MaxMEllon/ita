const { take, put, fork, call, takeEvery, select } = require('redux-saga/effects');
const { delay } = require('redux-saga');
const axios = require('axios');
const actions = require('../actions');
const Auth = require('../models/auth');

function* postTodoSaga() {
}

const signupRequest = (url, payload) => axios.post(url, payload)

const url = (state, path) => `${state.config.data.backendServer}${path}`;

function* signupUserSaga(action) {
  yield put(actions.pushLocation('/loading'));
  const { payload } = action;
  const state = yield select();
  try {
    const response = yield call(signupRequest, url(state, '/users/sign_up'), payload);
    const auth = yield call(Auth.dumpAuthTokenAsync, response.data.token);
    yield put(actions.successUserSignup(auth));
    yield delay(300)
    yield put(actions.pushLocation('/'));
  } catch (_err) {
    console.error('Invalid parameters');
    throw _err;
    process.exit(1);
  }
}

const rootSaga = function*() {
  yield takeEvery(`${actions.tryPostTodo}`, postTodoSaga);
  yield takeEvery(`${actions.tryUserSignup}`, signupUserSaga);
}

module.exports = rootSaga;
