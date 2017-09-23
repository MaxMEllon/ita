const R = require('ramda');
const { take, put, fork, call, takeEvery, select } = require('redux-saga/effects');
const { delay } = require('redux-saga');
const axios = require('axios');
const Maybe = require('maybe-baby');
const actions = require('../actions');
const Auth = require('../models/auth');
const Config = require('../models/config');

const url = (config, path) => `${config.backendServer}${path}`;

const createTodoRequest = (url, payload) => axios.post(url, payload);

function* postTodoSaga(action) {
  yield put(actions.pushLocation('/loading'));
  try {
    const state = yield select();
    const payload = R.merge(action.payload, { token: state.auth.data.token });
    const response = yield call(createTodoRequest, url(state.config.data, '/todos'), payload);
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
    const response = yield call(signupRequest, url(state.config/data, '/users/sign_up'), payload);
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

const fetchTodosRequest = (url, token) => axios.get(`${url}?token=${token}`);

const tryGetToken = async state => {
  const maybeToken = Maybe.of(state).props('auth', 'data', 'token');
  if (maybeToken.isJust()) return maybeToken;
  const auth = await Auth.restoreAsync();
  if (!auth) throw new Error('You must sign in or sign up before show the todo list');
  return auth.token;
};

const trySetConfig = async state => {
  const maybeConfig = Maybe.of(state).props('config', 'data');
  if (maybeConfig.isJust()) return maybeConfig;
  const config = await Config.restoreConfigAsync();
  if (!config) throw new Error('You must create ~/.config/ita/init.json before show the todo list');
  return config;
}

function* fetchTodosSaga(action) {
  yield put(actions.pushLocation('/loading'));
  try {
    const state = yield select();
    const token = yield call(tryGetToken, state);
    const config = yield call(trySetConfig, state);
    const response = yield call(fetchTodosRequest, url(config, '/todos'), token);
    yield put(actions.successFetchTodoList(response.data));
    const { payload } = action;
    yield put(actions.pushLocation(payload));
  } catch (_err) {
    console.error('Unauthenticated');
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
  yield takeEvery(`${actions.tryFetchTodoList}`, fetchTodosSaga);
}

module.exports = rootSaga;
