const { h, Component } = require('ink')
const { connect } = require('ink-redux')
const { ProgressSpinner } = require('ink-progress-spinner')
const Dashboard = require('../components/dashboard')
const Additional = require('../components/additional')
const Signup = require('../components/signup')
const List = require('../components/list')
const Updating = require('../components/updating')
const Slack = require('../components/slack')

const spinners = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'.split('')

class App extends Component {
  render({ location, dispatch, todos }) {
    switch (location.href) {
      case '/':
        return <Dashboard dispatch={dispatch} />
      case '/todos':
        return <List dispatch={dispatch} todos={todos} />
      case '/todos/edit':
        return <Updating dispatch={dispatch} todos={todos} />
      case '/todos/new':
        return <Additional dispatch={dispatch} />
      case '/users/new':
        return <Signup dispatch={dispatch} />
      case '/slack':
        return <Slack dispatch={dispatch} todos={todos} />
      case '/loading':
        return <ProgressSpinner characters={spinners} green />
      default:
        return <span>hoge</span>
    }
  }
}

module.exports = connect(state => state)(App)
