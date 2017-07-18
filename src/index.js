const program = require('commander');
const { h, render } = require('ink')
const readline = require('readline');
const Add = require('./components/add');
const List = require('./components/list');
const Done = require('./components/done');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

const argv = process.argv.slice(2);

process.stdin.on('keypress', (chunk,  key) => {
  if (key && key.name === "c" && key.ctrl) process.exit();
});

const run = () => {
  switch (argv[0]) {
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
  }
}

run();
