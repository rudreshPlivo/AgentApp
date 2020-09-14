const axios = require("axios");

class Agent {
  constructor(name, destination, skills) {
    this.id = null;
    this.name = name;
    this.destination = destination;
    this.skills = skills;
    this.status = "offline";
    this.teams = [];
  }

  async createAgent() {
    let config = {
      baseURL: `https://datastore.plivo.com/`,
    };
    let url = `v1/agents`;
    let data = {
      teams: [],
      name: this.name,
      destination: this.destination,
      skills: this.skills,
      status: this.status,
    };
    let newAgent = await axios.post(url, data, config);
    this.id = newAgent.data.data.id;
  }
}

module.exports = Agent;
