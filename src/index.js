const program = require('commander');
const { h, render } = require('ink');
const fs = require('fs');
const readline = require('readline');
const Add = require('./components/add');
const List = require('./components/list');
const Done = require('./components/done');
const Slack = require('./utils/slack');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

const argv = process.argv.slice(2);
const home = process.env.HOME;

process.stdin.on('keypress', (chunk,  key) => {
  if (key && key.name === "c" && key.ctrl) process.exit();
});

if (!fs.existsSync(`${home}/.todo.json`)) {
  const json = JSON.stringify({ todos: [], dones: [] });
}

const run = () => {
  switch (argv[0]) {
    case 'reset': {
      const json = JSON.stringify({ todos: [], dones: [] });
      fs.writeFile(`${home}/.todo.json`, json, (err) => {
        if (err) throw err;
        process.exit();
      });
      break;
    }
    case 'addm': {
      fs.readFile(`${home}/.todo.json`, 'utf8', (err, data) => {
        const todos = JSON.parse(data).todos;
        const n = argv[1];
        todos.push(n);
        fs.writeFile(`${home}/.todo.json`, JSON.stringify({ todos }), (err) => {
          if (err) throw err;
          render(<List />);
          setTimeout(() => {
            process.exit();
          }, 500)
        })
      })
      break;
    }
    case 'add': {
      render(<Add />);
      break;
    }
    case 'list': {
      render(<List />);
      break;
    }
    case 'done': {
      render(<Done />);
      break;
    }
    case 'report': {
      if (fs.existsSync(`${home}/.config/ita/init.json`)) {
        fs.readFile(`${home}/.config/ita/init.json`, 'utf8', (err, data) => {
          const config = JSON.parse(data);
          const client = new Slack(config.ita_slack_url);
          fs.readFile(`${home}/.todo.json`, 'utf8', (err, data) => {
            const json = JSON.parse(data);
            Promise.all([
              client.post({
                channel: config.ita_slack_channel,
                attachments: [{
                  pretext: 'TODO一覧',
                  fallback: 'TODO一覧',
                  color: '#f9f339',
                  fields: json.todos.map(todo => (
                    {
                      title: `:cyclone: ${todo}`,
                    }
                  ))
                }]
              }),
              client.post({
                channel: config.ita_slack_channel,
                attachments: [{
                  pretext: '完了一覧',
                  fallback: '完了一覧',
                  color: '#39ff39',
                  fields: json.dones.map(done => (
                    {
                      title: `:heavy_check_mark: ${done}`,
                    }
                  ))
                }]
              })
            ]).then(() => process.exit())
          })
        })
      }
    }
  }
}

run();
