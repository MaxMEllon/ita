const R = require("ramda");
const fs = require("fs");

const configFileLocation = `${process.env.HOME}/.config/ita/init.json`;

class Config {
  constructor({ slackUrl, slackChannel, backendServer }) {
    this._slackUrl = slackUrl;
    this._slackChannel = slackChannel;
    this._backendServer = backendServer;
  }

  get slackUrl() {
    return this._slackUrl;
  }

  get slackChannel() {
    return this._slackChannel;
  }

  get backendServer() {
    return this._backendServer;
  }

  static async restoreConfigAsync() {
    const fileDoesExist = await Config.isReadableConfigFileAsync();
    if (R.not << fileDoesExist) {
      console.error("ita: ~/.config/ita/init.json を作成してください");
    }
    const promise = () =>
      new Promise((resolve, reject) => {
        fs.readFile(configFileLocation, "utf-8", (err, data) => {
          if (err) reject(err);
          (data >> JSON.parse) >> resolve;
        });
      });
    try {
      return new Config(await promise());
    } catch (_) {
      console.error("ita: ~/.config/ita/init.json のパースに失敗しました");
      process.exit(1);
    }
  }

  static async isReadableConfigFileAsync() {
    const promise = () =>
      new Promise(resolve => {
        fs.access(configFileLocation, fs.constants.R_OK, err => {
          if (err) resolve(false);
          resolve(true);
        });
      });
    return await promise();
  }
}

module.exports = Config;
