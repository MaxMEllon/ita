const R = require('ramda');
const { take, put, fork, call, takeEvery, select } = require('redux-saga/effects');
const { delay } = require('redux-saga');
const axios = require('axios');
const actions = require('../actions');
const Auth = require('../models/auth');
const Config = require('../models/config');

const url = (state, path) => `${state.config.data.backendServer}${path}`;

const createTodoRequest = (url, payload) => axios.post(url, payload);

function* postTodoSaga(action) {
  yield put(actions.pushLocation('/loading'));
  try {
    const state = yield select();
    const payload = R.merge(action.payload, { token: state.auth.data.token });
    console.log(payload)
    const response = yield call(createTodoRequest, url(state, '/todos'), payload);
    yield put(actions.successPostTodo());
    console.info('Success to create of todo !!');
    yield put(actions.pushLocation('/'));
  } catch (_err) {
    console.error('Unauthenticated');
    throw _err;
    process.exit(1);
  }
}

const signupRequest = (url, payload) => axios.post(url, payload)

function* signupUserSaga(action) {
  yield put(actions.pushLocation('/loading'));
  try {
    const { payload } = action;
    const state = yield select();
    const response = yield call(signupRequest, url(state, '/users/sign_up'), payload);
    const auth = yield call(Auth.dumpAsync, response.data.token);
    yield put(actions.successUserSignup(auth));
    yield delay(300)
    console.info('Success!!');
    yield put(actions.pushLocation('/'));
  } catch (_err) {
    console.error('Invalid parameters');
    throw _err;
    process.exit(1);
  }
}

function* initalizeSaga() {
  const config = yield call(Config.restoreConfigAsync);
  const auth = yield call(Auth.restoreAsync);
  yield put(actions.initialized(config));
  yield put(actions.successUserSignup(auth));
}

const rootSaga = function*() {
  yield takeEvery(`${actions.initialize}`, initalizeSaga);
  yield takeEvery(`${actions.tryPostTodo}`, postTodoSaga);
  yield takeEvery(`${actions.tryUserSignup}`, signupUserSaga);
}

module.exports = rootSaga;
