// require('babel-polyfill');
const program = require('commander');
const { h, render } = require('ink');
const fs = require('fs');
const readline = require('readline');
const App = require('./containers/App');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

const argv = process.argv.slice(2);
const home = process.env.HOME;

process.stdin.on('keypress', (chunk,  key) => {
  if (key && key.name === "c" && key.ctrl) process.exit();
});

const run = () => render(<App />);

run();
