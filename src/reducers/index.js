const { combineReducers } = require('redux');
const { createReducer } = require('redux-act');
const actions = require('../actions');
const Config = require('../models/config');

const initalState = {
  location: { href: '/' },
  config: { state: Config.restoreConfig() }
};

module.exports.initalState = initalState;

const location = createReducer({
  [actions.pushLocation]: (_, payload) => {
    return { href: payload };
  },
}, initalState.location);

const config = createReducer({}, initalState.config);

module.exports = combineReducers({
  location,
  config,
});
