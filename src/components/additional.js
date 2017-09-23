const { h, render, Component, Indent } = require('ink');
const autoBind = require('react-autobind');
const TextInput = require('ink-text-input');
const actions = require('../actions');

class Additional extends Component {
  constructor() {
    super();
    this.state = { todo: '' };
    autoBind(this);
  }

  onChangeAndSubmit(chunk, key) {
    console.log('')
    if (key.name === 'return') {
      this.state.todo >> actions.tryPostTodo >> this.props.dispatch;
    } else if (key.name === 'backspace') {
      const { length } = this.state.todo;
      const nextTodo = this.state.todo.slice(0, length - 1);
      this.setState({ todo: nextTodo });
    } else {
      this.setState({ todo: this.state.todo + chunk });
    }
  }

  componentDidMount() {
    process.stdin.on('keypress', this.onChangeAndSubmit);
  }

  componentDidUnmount() {
    process.stdin.off('keypress', this.onChangeAndSubmit);
  }

  render(_, state) {
    return (
      <div>
        Enter your todo:
        <span> {this.state.todo}_</span>
      </div>
    )
  }
}

module.exports = Additional;
