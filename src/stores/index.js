const createSagaMiddleware = require('redux-saga').default
const { createStore, applyMiddleware, compose } = require('redux')
const reducer = require('../reducers')
const rootSaga = require('../sagas')

const configureStore = () => {
  const middlewares = []
  const sagaMiddleware = createSagaMiddleware()
  middlewares.push(sagaMiddleware)
  const store = reducer >> compose(applyMiddleware(...middlewares))(createStore)
  sagaMiddleware.run(rootSaga)
  return store
}

module.exports = configureStore
