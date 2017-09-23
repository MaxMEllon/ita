const { combineReducers } = require('redux');
const { createReducer } = require('redux-act');

const initalState = {
  sample: '',
};

module.exports.initalState = initalState;

const sample = createReducer({
  'sample_action': () => {
    return 'hoge'
  },
}, initalState.sample);

const reducer = combineReducers({
  sample,
});

module.exports = combineReducers({
  sample,
});
