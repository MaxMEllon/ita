const { h, Component, Text, Indent } = require('ink');
const { ProgressSpinner } = require('ink-progress-spinner');
const SelectInput = require('ink-select-input');
const Maybe = require('maybe-baby');
const autoBind = require('react-autobind');
const actions = require('../actions');
const Todo = require('../models/todo');

class Updating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fade: 0,
      progress: 0,
      isEventAdded: false,
    }
    autoBind(this);
  }

  get maybeTodos() {
    const maybeTodos = Maybe.of(this.props).props('todos', 'state');
    return maybeTodos;
  }

  get items() {
    if (this.maybeTodos.isNothing()) return [];
    return this.maybeTodos.join().map(todo => ({
      label: todo.title,
      value: todo.id,
    }));
  }

  componentDidMount() {
    if (this.maybeTodos.isNothing()) '/todos/edit' >> actions.tryFetchTodoList >> this.props.dispatch;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.fade === 1 && nextState.isEventAdded === false) {
      process.stdin.on('keypress', this.onChangeProgress);
      this.setState({ isEventAdded: true });
    }
  }

  componentWillUnmount() {
    process.stdin.removeListener('keypress', this.onChangeProgress);
  }

  onChangeProgress(_, key) {
    switch (key.name) {
      case 'left': {
        if (this.state.progress > 0) {
          this.setState({ progress: this.state.progress - 1 });
        }
        break;
      }
      case 'right': {
        if (this.state.progress < 20) {
          this.setState({ progress: this.state.progress + 1 });
        }
        break;
      }
      case 'return': {
        this.state >> actions.tryUpdateTodo >> this.props.dispatch;
      }
    }
  }

  onSelect(item) {
    if (this.maybeTodos.isNothing()) return;
    this.setState({ id: item.value, fade: 1 });
  }

  render(props, state) {
    switch (state.fade) {
      case 0:
        return (
          <span>
            <SelectInput
              items={this.items}
              onSelect={this.onSelect}
            />
          </span>
        );
      case 1: {
        const todo = Todo.find(state.id, props.todos.state);
        return (
          <span>
            <Text>{todo.title} (current: {todo.percent.padStart(5)})</Text>
            <br />
            <Text>[{'='.repeat(state.progress)}</Text>
            <Text>{' '.repeat(20 - state.progress)}]</Text>
            <span>  </span>
            <Text>{`${state.progress * 5}`.padStart(5)}%</Text>
          </span>
        )
      }
      default:
        return null;
    }
  }
}

module.exports = Updating;
