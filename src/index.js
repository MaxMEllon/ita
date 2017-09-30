const { h, render } = require('ink')
const readline = require('readline')
const { Provider } = require('ink-redux')
const App = require('./containers/App')
const { initialState } = require('./reducers')
const createStore = require('./stores')

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)
process.stdin.resume()
process.stdin.setEncoding('utf8')

process.stdin.on('keypress', (chunk, key) => {
  if (key && key.name === 'c' && key.ctrl) process.exit()
})

const store = createStore(initialState)

const run = () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

run()
