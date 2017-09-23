const { h, Text, Component } = require('ink');
const SelectInput = require('ink-select-input');
const autoBind = require('react-autobind');
const actions = require('../actions');

const Dashboard = ({ dispatch }) => {
  const items = () => (
    [{
      label: 'Add Todo',
      value: '/todos/new'
    }, {
      label: 'Show todo list',
      value: '/todos'
    }, {
      label: 'Update todo progress',
      value: '/todos/edit'
    }, {
      label: 'Report to slack',
      value: '/slack'
    }]
  )

  const onSelect = item => {
    item.value >> actions.pushLocation >> dispatch;
  }

  return (
    <span>
      <SelectInput
        items={items()}
        onSelect={onSelect}
      />
    </span>
  )
};

module.exports = Dashboard;
