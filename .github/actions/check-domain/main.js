const core = require("@actions/core");
const github = require("@actions/github");
const request = require("request");
const util = require("util");

const restrictedDomains = require("../../../restricted_domains.json");
const primaryDomain = core.getInput("primaryDomain", {required: true});
const repoToken = core.getInput("repoToken", {required: true});
const registeredDomainsUrl = core.getInput("domainDataUrl", {required: true});
const registrationInfoKeys = ["domain", "target", "use_cf", "agree_tos"];

async function run() {
  try {
    const prPayload = github.context.payload.pull_request;
    const registrationInfo = getRegistrationInfo(prPayload.body);
    const checkSummaryObj = {
      valid: isValidSubdomain(registrationInfo.subdomain),
      not_restricted: isNotRestrictedSubdomain(registrationInfo.subdomain),
      available: await isSubdomainAvailability(registrationInfo.subdomain),
      use_cloudflare: yesNoToBoolean(registrationInfo.use_cf),
      agree_tos: yesNoToBoolean(registrationInfo.agree_tos)
    };

    const checkSummaryResult = Object.keys(checkSummaryObj).filter((key) => key !== "use_cloudflare")
      .map((key) => checkSummaryObj[key]);

    if (checkSummaryResult.some((val) => val == false)) {
      core.setFailed(checkSummaryObj);
    }

    await commentCheckSummaryToPR(prPayload.number, checkSummaryObj);
  } catch (error) {
    core.setFailed(error);
  }
}

function getRegistrationInfo(prBody) {
  const regData = prBody.split(/\r?\n/);
  const regInfo = {};

  registrationInfoKeys.forEach((key, idx) => regInfo[key] = regData[idx].split(":").pop().trim());
  regInfo["subdomain"] = getSubdomainFromDomain(regInfo["domain"]);

  return regInfo;
}

function getSubdomainFromDomain(domainName) {
  const primaryDomainLength = primaryDomain.split(".").length;
  const subdomainName = domainName.split(".");

  subdomainName.splice(primaryDomainLength * -1)

  return subdomainName.join("");
}

function isValidSubdomain(subdomainName) {
  return subdomainName && /^[a-z0-9]+\-?[a-z0-9]+$/.test(subdomainName);
}

function isNotRestrictedSubdomain(subdomainName) {
  return restrictedDomains.indexOf(subdomainName) == -1;
}

function yesNoToBoolean(str) {
  return /^yes$/i.test(str);
}

function boolToEmoji(booleanValue) {
  if (booleanValue) {
    return ":heavy_check_mark:";
  }

  return ":heavy_multiplication_x:";
}

async function isSubdomainAvailability(subdomainName) {
  const requestOpts = {json: true};
  const requestPromise = util.promisify(request);
  const response = await requestPromise(registeredDomainsUrl, requestOpts);

  return (response.statusCode == 200 && response.body[subdomainName] == void 0);
}

async function commentCheckSummaryToPR(prNumber, checkSummaryObj) {
  const summaryContent = ["| Name | Result |", "| --- | --- |"];
  const githubClient = new github.GitHub(repoToken);
  let availableContent = `| Subdomain available | ${boolToEmoji(checkSummaryObj.available)} |`;

  if (checkSummaryObj.available !== true) {
    availableContent += " - [**Check Whois**]()";
  }

  summaryContent.push(`| Valid subdomain | ${boolToEmoji(checkSummaryObj.valid)} |`);
  summaryContent.push(`| Not restricted | ${boolToEmoji(checkSummaryObj.not_restricted)} |`);
  summaryContent.push(availableContent);
  summaryContent.push(`| Use Cloudflare proxy | ${boolToEmoji(checkSummaryObj.use_cloudflare)} |`);
  summaryContent.push(`| Agree with [**ToS**]() | ${boolToEmoji(checkSummaryObj.agree_tos)} |`);

  await githubClient.issues.createComment({
    ...github.context.repo,
    issue_number: prNumber,
    body: summaryContent.join("\r\n")
  });
}

run();
