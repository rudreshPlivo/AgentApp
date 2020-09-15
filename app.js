const axios = require("axios");
const env = require("./environment");
const Team = require("./Team");

//configure axios defaults
axios.defaults.baseURL = env.baseURL;
axios.defaults.headers.common["Authorization"] = env.auth;
axios.defaults.headers.post["Content-Type"] = "application/json";

//teams array

let teamArray = [
  {
    name: `BigFoodieChinese`,
    csv: `BigFoodieChinese.csv`,
  },
  {
    name: `BigFoodieEnglish`,
    csv: `BigFoodieEnglish.csv`,
  },
  {
    name: `Sales`,
    csv: `Sales.csv`,
  },
  {
    name: `VipQueue`,
    csv: `Vipclients.csv`,
  },
  {
    name: `BigQueue`,
    csv: `BigQueue.csv`,
  },
];

//team array
let createdTeamArray = [];

//create Teams
(async function () {
  for (let team of teamArray) {
    let newTeam = new Team(team.name, team.csv);
    await newTeam.createTeam();
    createdTeamArray.push(newTeam);
    console.log(`newTeam - ${newTeam.name}`);
  }

  for (let team of createdTeamArray) {
    await team.createAgentsForTeam();
    syncWait(5000);
    console.log(`agents created for team - ${team.name}`);
  }

  function syncWait(ms) {
    let end = Date.now() + ms;
    while (Date.now() < end) continue;
  }

  /*
  let BigFoodieChinese = new Team("BigFoodieChinese", "BigFoodieChinese.csv");
  await BigFoodieChinese.createTeam();
  await BigFoodieChinese.createAgentsForTeam();
  console.log("Chinese Team Created");

  let BigFoodieEnglish = new Team("BigFoodieEnglish", "BigFoodieEnglish.csv");
  await BigFoodieEnglish.createTeam();
  await BigFoodieEnglish.createAgentsForTeam();
  console.log("English Team Created");

  let BigQueue = new Team("BigQueue", "BigQueue.csv");
  await BigQueue.createTeam();
  await BigQueue.createAgentsForTeam();
  console.log("Big Queue Created");

  let Sales = new Team("Sales", "Sales.csv");
  await Sales.createTeam();
  await Sales.createAgentsForTeam();
  console.log("Sales Queue created");

  let VipClients = new Team("VipClients", "VipClients.csv");
  await VipClients.createTeam();
  await VipClients.createAgentsForTeam();
  console.log("Vip Queue Created"); */
})();
