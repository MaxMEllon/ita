const { take, fork, takeEvery } = require('redux-saga/effects');
const actions = require('../actions');

function* sampleSaga() {
  while (true) {
    yield take('sample_aciton');
  }
}

const rootSaga = function*() {
  yield takeEvery('sample_actions', sampleSaga);
}

module.exports = rootSaga;
