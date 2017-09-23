const { h, render, Component } = require('ink');
const autoBind = require('react-autobind');
const { connect } = require('ink-redux');
const Dashboard = require('../components/dashboard');
const Additional = require('../components/additional');

const App = ({ location, dispatch }) => {
  switch (location.href) {
    case '/':
      return <Dashboard dispatch={dispatch} />;
    case '/todos/new':
      return <Additional dispatch={dispatch}/>
    default:
      return <span>hoge</span>
  }
}

module.exports = connect(state => state)(App);
