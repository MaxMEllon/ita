const { combineReducers } = require('redux');
const { createReducer } = require('redux-act');
const actions = require('../actions');
const Config = require('../models/config');
const Auth = require('../models/auth');
const Todo = require('../models/todo');

const initalState = {
  location: { href: '/' },
  config: { data: null },
  auth: { data: null },
  todos: { state: null },
};

module.exports.initalState = initalState;

const location = createReducer({
  [actions.pushLocation]: (_, payload) => {
    return { href: payload };
  },
}, initalState.location);

const config = createReducer({
  [actions.initialized]: (_, payload) => {
    return { data: payload };
  },
}, initalState.config);

const auth = createReducer({
  [actions.successUserSignup]: (_, payload) => {
    return { data: payload };
  },
}, initalState.auth);

const todos = createReducer({
  [actions.successFetchTodoList]: (_, payload) => {
    const state = payload.map(todo => new Todo(todo));
    return { state };
  }
}, initalState.todos);

module.exports = combineReducers({
  location,
  config,
  auth,
  todos,
});
