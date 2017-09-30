const { h, Component } = require('ink')
const { ProgressSpinner } = require('ink-progress-spinner')
const SelectInput = require('ink-select-input')
const autoBind = require('react-autobind')
const actions = require('../actions')

const spinners = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'.split('')

class Slack extends Component {
  constructor(props) {
    super(props)
    autoBind(this)
  }

  componentDidMount() {
    if (this.props.todos.state === null)
      ('/slack' >> actions.tryFetchTodoList) >> this.props.dispatch
  }

  get items() {
    return [
      {
        label: 'done',
        value: 'done'
      },
      {
        label: 'doing',
        value: 'doing'
      },
      {
        label: 'todo',
        value: 'todo'
      },
      {
        label: 'all',
        value: 'all'
      }
    ]
  }

  onSelect(item) {
    const _ =
      ({ type: item.value, todos: this.props.todos.state } >> actions.reportToSlack) >>
      this.props.dispatch
  }

  render(props) {
    const { state } = props.todos
    if (state === null) return <ProgressSpinner characters={spinners} green />
    return (
      <span>
        <SelectInput items={this.items} onSelect={this.onSelect} />
      </span>
    )
  }
}

module.exports = Slack
