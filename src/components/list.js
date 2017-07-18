const { h, render, Component, Text } = require('ink');
const TextInput = require('ink-text-input');
const { spinners, ProgressSpinner } = require('ink-progress-spinner')
const fs = require('fs');

const home = process.env.HOME;

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      loading: true,
    };
  }

  componentDidMount() {
    fs.readFile(`${home}/.todo.json`, 'utf8', (err, data) => {
      const todos = JSON.parse(data).todos;
      this.setState({ todos, loading: false });
      setTimeout(() => {
        process.exit();
      }, 500);
    })
  }

  render(props, state) {
    if (state.loading) return <ProgressSpinner characteds={spinners[25].split('')} />;
    if (state.todos.length === 0) return <Text yellow>Nothing todo.</Text>
    return (
      <span>
        {
          state.todos.map(todo => (
            <div>
              <span> - </span>
              <Text green>{todo}</Text>
            </div>
          ))
        }
      </span>
    );
  }
}

module.exports = TodoList;
