const { h, render, Component } = require('ink');
const autoBind = require('react-autobind');
const { Provider } = require('ink-redux');
const createStore = require('../stores');
const { initialState } = require('../reducers');
const Dashboard = require('../components/dashboard');

const store = createStore(initialState);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      href: '/',
    };
    autoBind(this);
  }

  render() {
    return (
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
  }
}

module.exports = App;
