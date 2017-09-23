const { take, fork, takeEvery } = require('redux-saga/effects');
const actions = require('../actions');

function* postTodoSaga() {
}

const rootSaga = function*() {
  yield takeEvery(`${actions.tryPostTodo}`, postTodoSaga);
}

module.exports = rootSaga;
