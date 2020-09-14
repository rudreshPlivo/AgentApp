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
    csv: `BigfoodieChinese.csv`,
  },
  {
    name: `BigFoodieEnglish`,
    csv: `BigFoodieEnglish.csv`,
  },
  {
    name: `BigQueue`,
    csv: `BigQueue.csv`,
  },
  {
    name: `Sales`,
    csv: `Sales.csv`,
  },
  {
    name: `VipQueue`,
    csv: `Vipclients.csv`,
  },
];

//create Teams
(async function () {
  for (let team of teamArray) {
    let newTeam = new Team(team.name, team.csv);
    await newTeam.createTeam();
    await newTeam.createAgentsForTeam();
    console.log(`newTeam - ${newTeam.name}`);
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
