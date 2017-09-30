const { h } = require('ink')
const actions = require('../actions')

const Dashboard = ({ dispatch }) => {
  const items = () => [
    {
      label: 'Add Todo',
      value: '/todos/new'
    },
    {
      label: 'Show todo list',
      value: '/todos'
    },
    {
      label: 'Update todo progress',
      value: '/todos/edit'
    },
    {
      label: 'Report to slack',
      value: '/slack'
    },
    {
      label: '--------------',
      value: ''
    },
    {
      label: 'Sign up User',
      value: '/users/new'
    },
    {
      label: 'Sign in User',
      value: '/session/new'
    }
  ]

  const onSelect = item => {
    if (item.value === '') return
    ;(item.value >> actions.pushLocation) >> dispatch
  }

  return (
    <span>
      <SelectInput items={items()} onSelect={onSelect} />
    </span>
  )
}

module.exports = Dashboard
