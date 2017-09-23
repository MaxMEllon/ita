const { h, render, Component } = require('ink');
const autoBind = require('react-autobind');
const { connect } = require('ink-redux');
const { ProgressSpinner } = require('ink-progress-spinner');
const Dashboard = require('../components/dashboard');
const Additional = require('../components/additional');
const Signup = require('../components/signup');
const actions = require('../actions');

const spinners = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'.split('');

let initalized = false;

const initializeIfNeeded = dispatch => {
  if (initalized) return;
  actions.initialize() >> dispatch
  initalized = true;
}

const App = ({ location, dispatch }) => {
  initializeIfNeeded(dispatch);
  switch (location.href) {
    case '/':
      return <Dashboard dispatch={dispatch} />;
    case '/todos/new':
      return <Additional dispatch={dispatch} />;
    case '/users/new':
      return <Signup dispatch={dispatch} />;
    case '/loading':
      return <ProgressSpinner characters={spinners} green />
    default:
      return <span>hoge</span>
  }
}

module.exports = connect(state => state)(App);
