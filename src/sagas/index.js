const R = require('ramda');
const { take, put, fork, call, takeEvery, select } = require('redux-saga/effects');
const { delay } = require('redux-saga');
const axios = require('axios');
const Maybe = require('maybe-baby');
const actions = require('../actions');
const Auth = require('../models/auth');
const Config = require('../models/config');
const Todo = require('../models/todo');
const Slack = require('../utils/slack');

const url = (config, path) => `${config.backendServer}${path}`;

const signupRequest = (url, payload) => axios.post(url, payload)

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
};

function* signupUserSaga(action) {
  yield put(actions.pushLocation('/loading'));
  try {
    const { payload } = action;
    const state = yield select();
    const config = yield call(trySetConfig, state);
    const response = yield call(signupRequest, url(config, '/users/sign_up'), payload);
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

const updateTodoRequest = (url, payload) => axios.patch(url, payload);

function* updateTodoSaga(action) {
  yield put(actions.pushLocation('/loading'));
  try {
    const state = yield select();
    const token = yield call(tryGetToken, state);
    const { payload } = action
    const config = yield call(trySetConfig, state);
    const reqBody = {
      token,
      todo: {
        progress: (payload.progress * 5),
      },
    };
    const response = yield call(updateTodoRequest, url(config, `/todos/${payload.id}`), reqBody);
    yield put(actions.successUpdateTodo(response.data));
    console.info('Updated!!')
    yield put(actions.tryFetchTodoList('/'));
    delay(200);
    yield put(actions.pushLocation('/'));
  } catch (_err) {
    console.error('Invalid parameters');
    throw _err;
    process.exit(1);
  }
}

const createTodoRequest = (url, payload) => axios.post(url, payload);

function* postTodoSaga(action) {
  yield put(actions.pushLocation('/loading'));
  try {
    const state = yield select();
    const token = yield call(tryGetToken, state);
    const config = yield call(trySetConfig, state);
    const payload = R.merge(action.payload, { token });
    const response = yield call(createTodoRequest, url(config, '/todos'), payload);
    yield put(actions.successPostTodo());
    console.info('Success to create of todo !!');
    yield put(actions.pushLocation('/'));
  } catch (_err) {
    console.error('Unauthenticated');
    throw _err;
    process.exit(1);
  }
}

const slackActionCreator = (client, config) => ({
  todo: (list) => (
    client.post({
      channel: config.slackChannel,
      attachments: [{
        pretext: 'TODO一覧',
        fallback: 'TODO一覧',
        color: '#f93339',
        fields: Todo.todo(list).map(todo => ({
          title: `:cyclone: ${todo.percent.padStart(5)} ${todo.title}`
        }))
      }]
    })
  ),
  doing: (list) => (
    client.post({
      channel: config.slackChannel,
      attachments: [{
        pretext: '作業中',
        fallback: '作業中',
        color: '#f9f339',
        fields: Todo.doing(list).map(todo => ({
          title: `:fire: ${todo.percent.padStart(5)} ${todo.title}`
        }))
      }]
    })
  ),
  done: (list) => (
    client.post({
      channel: config.slackChannel,
      attachments: [{
        pretext: '完了',
        fallback: '完了',
        color: '#39f339',
        fields: Todo.done(list).map(todo => ({
          title: `:clapping: ${todo.percent.padStart(5)} ${todo.title}`
        }))
      }]
    })
  ),
  all: (list) => (
    client.post({
      channel: config.slackChannel,
      attachments: [{
        pretext: '全作業',
        fallback: '全作業',
        color: '#f9f3f9',
        fields: list.map(todo => ({
          title: `:white_check_mark: ${todo.percent.padStart(5)} ${todo.title}`
        }))
      }]
    })
  )
});

function* reportToSlackSaga(action) {
  yield put(actions.pushLocation('/loading'));
  const state = yield select();
  const config = yield call(trySetConfig, state);
  const client = new Slack(config.slackUrl);
  const { payload } = action;
  const slackActions = slackActionCreator(client, config);
  yield call(slackActions[payload.type], payload.todos);
  console.info('Reported !!');
  yield put(actions.pushLocation('/'));
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
  yield takeEvery(`${actions.tryUpdateTodo}`, updateTodoSaga);
  yield takeEvery(`${actions.reportToSlack}`, reportToSlackSaga);
}

module.exports = rootSaga;
