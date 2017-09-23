const { createAction } = require('redux-act');

const initialize = createAction('initialize');
const initialized = createAction('initialized');

const pushLocation = createAction('push_location');

const tryPostTodo = createAction('try_post_todo');
const successPostTodo = createAction('success_post_todo');

const tryUserSignup = createAction('try_user_signup');
const successUserSignup = createAction('success_user_signup');

const tryFetchTodoList = createAction('try_fetch_todo_list');
const successFetchTodoList = createAction('success_fetch_todo_list');

module.exports = {
  initialized,
  initialize,
  pushLocation,
  tryPostTodo,
  successPostTodo,
  tryUserSignup,
  successUserSignup,
  tryFetchTodoList,
  successFetchTodoList,
};
