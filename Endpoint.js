const axios = require("axios");

class Endpoint {
  constructor(name, username, password, alias, appId) {
    (this.id = null),
      (this.name = name),
      (this.username = username),
      (this.password = password),
      (this.appId = appId),
      (this.alias = alias);
    this.sip = null;
  }

  async createEndPoint() {
    //log an api request to Plivo to create endpoint

    let url = `/Endpoint/`;
    let endPointData = {
      username: this.username,
      password: this.password,
      alias: this.alias,
      app_id: this.appId,
    };
    try {
      let endPoint = await axios.post(url, endPointData);
      this.username = endPoint.data.username;
      this.id = endPoint.data.endpoint_id;
      this.sip = `sip:${this.username}@phone.plivo.com`;
    } catch (error) {
      console.log(error.data);
    }
  }

  getEndPointDetails() {
    return {
      id: this.id,
      username: this.username,
      alias: this.alias,
      application: this.appId,
      name: this.name,
    };
  }
}

module.exports = Endpoint;
