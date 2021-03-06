const core = require("@actions/core");
const github = require("@actions/github");
const request = require("request");
const util = require("util");
const ActionCommon = require("../common");

async function run() {
  try {
    const prPayload = github.context.payload.pull_request;
    const registrationInfoObj = ActionCommon.getReigstrationInfo(prPayload.body);
    const response = await createSubdoamin(registrationInfoObj);

    if (response.statusCode == 200 && response.body.success) {
      const congratContent = [
        "**Congratulations** :tada:!",
        "",
        "Your subdomain has been created. Please check back a few moments.",
        `https://${registrationInfoObj.subdomain}.php.onl`
      ].join("\r\n");

      await ActionCommon.commentToPR(prPayload.number, congratContent);
    } else {
      core.setFailed("Error :(");
    }

    await storeLog(JSON.stringify(response.body));
  } catch (error) {
    core.setFailed(error);
  }
}

async function createSubdoamin(registrationInfoObj) {
  const apiURL = core.getInput("apiUrl", {required: true});
  const apiToken = core.getInput("apiToken", {required: true});
  const reqPromise = util.promisify(request);
  const isUseCFProxy = ActionCommon.yesNoToBoolean(registrationInfoObj.use_cf)
  const dnsRecordContent = ActionCommon.getCNAMERecordContent(registrationInfoObj.target).hostname
  const reqJsonBody = {
    type: "CNAME",
    name: registrationInfoObj.subdomain,
    content: dnsRecordContent,
    ttl: 1,
    proxied: isUseCFProxy
  };

  return await reqPromise({
    method: "POST",
    url: apiURL,
    headers: {
      "Authorization": `Bearer ${apiToken}`
    },
    json: reqJsonBody
  });
}

async function storeLog(logContent) {
  const loggerUrl = core.getInput("loggerUrl", {required: true});
  const requestPromise = util.promisify(request);

  return await requestPromise.post(loggerUrl, {form: {content: logContent}});
}

run();
