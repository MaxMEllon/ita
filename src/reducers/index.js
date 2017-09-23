const { combineReducers } = require('redux');
const { createReducer } = require('redux-act');
const actions = require('../actions');

const initalState = {
  location: { href: '/' },
};

module.exports.initalState = initalState;

const location = createReducer({
  [actions.pushLocation]: (_, payload) => {
    return { href: payload };
  },
}, initalState.location);

module.exports = combineReducers({
  location,
});
