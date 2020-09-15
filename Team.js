const axios = require("axios");
const env = require("./environment");
const csv = require("@fast-csv/parse");
const Endpoint = require("./Endpoint");
const Agent = require("./Agent");

class Team {
  static agentMap = new Map();
  constructor(name, csvFileName) {
    this.id = null;
    this.name = name;
    this.active = false;
    this.csvFileName = csvFileName;
    this.agentNames = [];
    this.agentIds = [];
  }

  //create team using API in Plivo
  async createTeam() {
    let config = {
      baseURL: `https://datastore.plivo.com/`,
    };
    let url = `v1/teams`;
    let data = {
      name: this.name,
      active: this.active,
    };
    try {
      let newTeam = await axios.post(url, data, config);
      console.info(newTeam.data);
      console.info(`Team Id - ${newTeam.data.data.id}`);
      this.id = newTeam.data.data.id;
    } catch (error) {
      console.error(`error in creating the team - ${error}`);
    }
  }

  //populate teams array with agents as they are created.
  // Once all agents are added to the array, we will add entire array to Team
  addAgent(agentInst) {
    this.agentIds.push(agentInst.id);
    console.info(
      `adding agents to ${this.name} team - count ${this.agentIds.length}`
    );
  }

  //final mapping of agents array to the Team. All agent Ids will be in agents array
  async mapAgentsToTeam() {
    let config = {
      baseURL: `https://datastore.plivo.com/`,
    };
    console.info(`Team - ${this.name} Id ${this.id}`);
    let url = `v1/teams/${this.id}/agents`;
    let data = {
      agents: this.agentIds,
    };
    console.info(
      `count of agents created for team ${this.name} - ${data.agents.length}`
    );
    try {
      await axios.post(url, data, config);
    } catch (error) {
      console.info(`error in plivo adding agent to team ${error}`);
    }
  }

  async createAgentsForTeam() {
    //read agent names from csv files
    let fileName = this.csvFileName;
    let parserOptions = {
      objectMode: true,
      headers: true,
      trim: true,
    };
    csv
      .parseFile(fileName, parserOptions)
      .on("error", (error) => console.error(error))
      .on("data", (data) => {
        this.agentNames.push(JSON.stringify(data));
      })
      .on("end", async (rowCount) => await this.addAgentstoTeam());
  }

  //add agents to
  async addAgentstoTeam() {
    for await (let element of this.agentNames) {
      element = JSON.parse(element);
      //check if agent already exists. if does then just map to Team
      //Using map to keep track of which agents have already been created already for a different team.
      //Hence agentMap is static - key is agentname as in csv file and value is agent instance object
      let agentInstance = Team.agentMap.get(element.name);
      console.info(`checking if agent is in map - ${element.name}`);
      if (agentInstance) {
        //agent exists map to Team.
        try {
          this.addAgent(agentInstance); //only adds agentId in array "agentIds"
        } catch (error) {
          console.error(`error in adding agentID to team array ${error}`);
        }
      } else {
        //agent doesnt exist. create agent. This may result in creation of duplicate agents
        //first create endpoint
        let agentEndpoint = new Endpoint(
          element.name,
          element.name,
          env.defaultpw,
          element.name,
          env.defaultApp
        );
        try {
          await agentEndpoint.createEndPoint();
        } catch (error) {
          console.error(`error in creating endpoint-----${error}`);
        }
        //now add agent using just created endpoint
        let thisAgent = null;
        try {
          thisAgent = new Agent(
            agentEndpoint.name,
            agentEndpoint.sip,
            env.skills
          );
          await thisAgent.createAgent(); //create agent with Plivo
        } catch (error) {
          console.error(`error in creating new Agent ${error}`);
        }
        //then map agent to Team and add it to agentMap so that we dont create agent twice
        try {
          console.info(`adding agent to map - ${element.name}`);
          Team.agentMap.set(element.name, thisAgent);
          this.addAgent(thisAgent);
        } catch (error) {
          console.error(`error while adding agentId to team array - ${error}`);
        }
      }
    }
    //Once all agentIds are populated in AgentId array, you can map agents to team.
    console.info(`this will execute once for each team...${this.name}`);
    await this.mapAgentsToTeam();
  }
}

module.exports = Team;
