const authId = process.env.PLIVO_AUTH_ID; //replace auth Id
const authToken = process.env.PLIVO_AUTH_TOKEN; //replace auth token
const defaultPassword = `touch2success`; //default password for sip url
const defaultAppId = `11171595981063813`; // default appliation attached to sip url https://console.plivo.com/voice/applications/

const plivoCred = {
  auth: getAuth(),
  baseURL: `https://api.plivo.com/v1/Account/${authId}`,
  defaultpw: defaultPassword,
  defaultApp: defaultAppId,
  skills: `English`,
};

function getAuth() {
  let buf = Buffer.from(authId + ":" + authToken).toString("base64");
  return `Basic ${buf}`;
}

module.exports = plivoCred;
