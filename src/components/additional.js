const { h, Component } = require('ink')
const autoBind = require('react-autobind')
const actions = require('../actions')

class Additional extends Component {
  constructor() {
    super()
    this.state = {
      todo: {
        title: ''
      }
    }
    autoBind(this)
  }

  onChangeAndSubmit(chunk, key) {
    /* eslint no-console: [0] */
    console.info('')
    if (key.name === 'return') {
      ;(this.state >> actions.tryPostTodo) >> this.props.dispatch
    } else if (key.name === 'backspace') {
      const { length } = this.state.todo.title
      const title = this.state.todo.title.slice(0, length - 1)
      this.setState({ todo: { title } })
    } else {
      const { title } = this.state.todo
      this.setState({ todo: { title: title + chunk } })
    }
  }

  componentDidMount() {
    process.stdin.on('keypress', this.onChangeAndSubmit)
  }

  componentDidUnmount() {
    process.stdin.removeListener('keypress', this.onChangeAndSubmit)
  }

  render() {
    return (
      <div>
        Enter your todo:
        <Text> {this.state.todo.title}_</Text>
      </div>
    )
  }
}

module.exports = Additional
