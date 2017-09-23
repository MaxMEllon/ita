const { createAction } = require('redux-act');

const pushLocation = createAction('push_location');

const tryPostTodo = createAction('try_post_todo');

module.exports = {
  pushLocation,
  tryPostTodo,
};
