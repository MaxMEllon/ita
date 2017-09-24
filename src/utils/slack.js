const _ = require("lodash");
const axios = require("axios");

class Slack {
  get defaultOptions() {
    return {
      username: "めろんぐま",
      icon_emoji: ":guma:",
      text: "",
      channel: "#general"
    };
  }

  constructor(url) {
    this.url = url;
  }

  post(options) {
    const opt = _.assign({}, this.defaultOptions, options);
    return axios
      .post(this.url, opt)
      .then(res => console.log(res.status + res.data))
      .catch(err => console.error(err));
  }
}

module.exports = Slack;
