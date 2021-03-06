const { h, Component, Text } = require('ink')
const { ProgressSpinner } = require('ink-progress-spinner')
const actions = require('../actions')

const spinners = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'.split('')

class List extends Component {
  componentDidMount() {
    if (this.props.todos.state === null)
      ('/todos' >> actions.tryFetchTodoList) >> this.props.dispatch
  }

  render(props) {
    const { state } = props.todos
    if (state === null) return <ProgressSpinner characters={spinners} green />
    return (
      <div>
        {state.map(todo => (
          <div>
            <Text {...todo.color}>[{'='.repeat(todo.blockCount)}</Text>
            <Text {...todo.color}>{' '.repeat(20 - todo.blockCount)}]</Text>
            <span />
            <Text {...todo.color}>{todo.percent.padStart(5)}</Text>
            <span />
            <Text>{todo.title}</Text>
          </div>
        ))}
      </div>
    )
  }
}

module.exports = List
