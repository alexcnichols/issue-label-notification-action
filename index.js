const core = require('@actions/core');
const github = require('@actions/github');
const { correctRecipients, findMentions, correctMessage } = require('./utils');

async function run() {
  try {
    const issueNumber = github.context.payload.issue.number;
    const issueBody = github.context.payload.issue.body;
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const label = github.context.payload.label.name;

    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
    const token = core.getInput('token');
    const octokit = new github.GitHub(token);

    const labelRecipients = core.getInput('recipients').split("\n");
    const match = labelRecipients.find((labelRecipient) => {
      return labelRecipient.split("=")[0] === label;
    });

    if (match) {
      const message = core.getInput('message');
      const suppressMentioned = core.getInput('suppress-mentioned');
      var recipientsToSuppress;

      if (suppressMentioned && suppressMentioned === 'true') {
        recipientsToSuppress = findMentions(issueBody);
      }

      const recipients = correctRecipients(match.split("=")[1], recipientsToSuppress);
      const comment = correctMessage(message, recipients, label);
      const createCommentResponse = await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: comment
      });
    } else {
      console.log("No matching recipients found for label ${label}.");
    }
  } catch (error) {
    console.error(error);
    core.setFailed(`The issue-label-notification-action action failed with ${error}`);
  }
}

run();
