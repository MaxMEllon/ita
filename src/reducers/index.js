const { combineReducers } = require('redux');
const { createReducer } = require('redux-act');
const actions = require('../actions');
const Config = require('../models/config');
const Auth = require('../models/auth');

const initalState = {
  location: { href: '/' },
  config: { data: null },
  auth: { data: null },
};

Config.restoreConfigAsync().then(data => (initalState.config.data = data));
Auth.restoreAsync().then(data => (initalState.auth.data = data));

module.exports.initalState = initalState;

const location = createReducer({
  [actions.pushLocation]: (_, payload) => {
    return { href: payload };
  },
}, initalState.location);

const config = createReducer({}, initalState.config);

const auth = createReducer({
  [actions.successUserSignup]: (_, payload) => {
    return { data: payload };
  },
}, initalState.auth);

module.exports = combineReducers({
  location,
  config,
  auth,
});
