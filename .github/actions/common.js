const github = require("@actions/github");

const registrationInfoKeys = ["domain", "target", "use_cf", "agree_tos"];
const primaryDomain = process.env.PRIMARY_DOMAIN;

module.exports = {
  getReigstrationInfo: function(prBody) {
    const regData = prBody.split(/\r?\n/);
    const regInfo = {};

    registrationInfoKeys.forEach((key, idx) => regInfo[key] = regData[idx].split(":").pop().trim());
    regInfo["subdomain"] = this.getSubdomainFromDomain(regInfo["domain"]);

    return regInfo;
  },
  getSubdomainFromDomain: function(domainName) {
    const primaryDomainLength = primaryDomain.split(".").length;
    const subdomainName = domainName.split(".");

    subdomainName.splice(primaryDomainLength * -1)

    return subdomainName.join("");
  },
  yesNoToBoolean: function(str) {
    return /^yes$/i.test(str);
  },
  getCNAMERecordContent: function(subdomainTarget) {
    return new URL(`http://${subdomainTarget.replace(/^https?\:\/\/(www\.)?/, "")}`);
  },
  commentToPR: async function(prNumber, content) {
    const githubToken = process.env.REPO_TOKEN;
    const githubClient = new github.GitHub(githubToken);

    return await githubClient.issues.createComment({
      ...github.context.repo,
      issue_number: prNumber,
      body: content
    });
  }
}
