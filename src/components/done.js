const { h, render, Component, Text } = require('ink');
const { List, ListItem } = require('ink-checkbox-list');
const { spinners, ProgressSpinner } = require('ink-progress-spinner')
const fs = require('fs');

const home = process.env.HOME;

class DoneComponent extends Component {
  constructor() {
    super();
    this.state = {
      todos: '',
      loading: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fs.readFile(`${home}/.todo.json`, 'utf8', (err, data) => {
      const todos = JSON.parse(data).todos;
      this.setState({ todos, loading: false });
    })
  }

  handleSubmit(values) {
    const { todos } = this.state;
    values.forEach(value => {
      const index = todos.indexOf(value);
      todos.splice(index, 1);
    });
    const json = JSON.stringify({ todos, dones: values });
    fs.writeFile(`${home}/.todo.json`, json, (err) => {
      if (err) throw err;
      process.exit();
    })
  }

  render(props, state) {
    if (state.loading) return <ProgressSpinner characteds={spinners[25].split('')} />
    return (
      <List onSubmit={this.handleSubmit}>
        <div>
          <Text yellow>Please select done todos.</Text>
        </div>
        {
          state.todos.map(todo => (
            <ListItem value={todo}>{todo}</ListItem>
          ))
        }
      </List>
    );
  }
}

module.exports = DoneComponent;
