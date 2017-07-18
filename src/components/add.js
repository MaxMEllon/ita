const { h, render, Component, Text } = require('ink');
const TextInput = require('ink-text-input');
const fs = require('fs');

const home = process.env.HOME;

class AddTodoComponent extends Component {
  constructor() {
    super();
    this.state = {
      todo: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(value) {
    this.setState({ todo: value });
  }

  handleSubmit(value) {
    fs.readFile(`${home}/.todo.json`, 'utf8', (err, data) => {
      const todos = JSON.parse(data).todos;
      todos.push(value);
      render(
        <div>
          <span>Registed todo: </span>
          <Text green>[{value}]</Text>
        </div>
      );
      fs.writeFile(`${home}/.todo.json`, JSON.stringify({ todos }), (err) => {
        if (err) throw err;
        process.exit();
      })
    })
  }

  render(props, state) {
    return (
      <span>
        <Text yellow>Please your todo: </Text>
        <TextInput
          value={state.todo}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
      </span>
    );
  }
}

module.exports = AddTodoComponent;
