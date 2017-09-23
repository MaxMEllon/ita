const R = require('ramda');
const fs = require('fs');

const configFileLocation = `${process.env.HOME}/.config/ita/auth.json`;

class Auth {
  constructor(token) {
    this._token = token;
  }

  get token() {
    return token;
  }

  static async dumpAuthTokenAsync(token) {
    const json = JSON.stringify({ token });
    const promise = () => new Promise((resolve, reject) => {
      fs.writeFile(configFileLocation, json, 'utf-8', err => {
        if (err) reject(err);
        resolve(new Auth(token));
      })
    });
    return await promise();
  }

  static async restoreAuthTokenAsync() {
    if (await Config.isReadableConfigFileAsync() >> R.not) return;
    const promise = () => new Promise((resolve, reject) => {
      fs.readFile(configFileLocation, 'utf-8', (err, data) => {
        if (err) reject(err);
        resolve(data);
      })
    });
    const json = await promise();
    const auth = new Auth(JSON.parse(json));
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

module.exports = Auth;
