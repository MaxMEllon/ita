const R = require('ramda');
const fs = require('fs');

const configFileLocation = `${process.env.HOME}/.config/ita/init.json`;

class Config {
  constructor({ slackUrl, slackChannel, backendServer }) {
    this._slackUrl = slackUrl;
    this._slackChannel = slackChannel;
    this._backendServer = backendServer;
  }

  get url() {
    return this._slackUrl;
  }

  get channel() {
    return this._slackChannel;
  }

  get backendServer() {
    return this._backendServer;
  }

  static async restoreConfigAsync() {
    if (await Config.isReadableConfigFileAsync() >> R.not) {
      console.error('ita: ~/.config/ita/init.json を作成してください');
    }
    const promise = () => new Promise((resolve, reject) => {
      fs.readFile(configFileLocation, 'utf-8', (err, data) => {
        if (err) reject(err);
        resolve(data);
      })
    });
    try {
      const json = await promise();
      const config = new Config(JSON.parse(json));
      return config;
    } catch (_) {
      console.error('ita: ~/.config/ita/init.json のパースに失敗しました');
      process.exit(1);
    }
  }

  static async isReadableConfigFileAsync() {
    const promise = () => new Promise((resolve, reject) => {
      fs.access(configFileLocation, fs.constants.R_OK, err => {
        if (err) reject(false);
        resolve(true);
      })
    });
    return await promise();
  }
}

module.exports = Config;
