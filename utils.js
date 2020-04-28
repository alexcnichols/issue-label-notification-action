function correctRecipients(recipients, recipientsToSuppress) {
  const normalizedRecipients = normalizeRecipients(recipients);
  var correctedRecipients = normalizedRecipients;

  if (recipientsToSuppress) {
    const normalizedRecipientsToSuppress = normalizeRecipients(recipientsToSuppress.join(' ')).split(' ');

    if (normalizedRecipientsToSuppress) {
      const recipientsList = normalizedRecipients.split(' ');
      for (let index = 0; index < recipientsList.length; index++) {
        const recipient = recipientsList[index];
        recipientsList[index] = normalizedRecipientsToSuppress.indexOf(recipient) === -1 ? recipient : '`' + recipient + '`';
      }
      correctedRecipients = recipientsList.join(' ');
    }
  }
  return correctedRecipients;
}

function normalizeRecipients(recipients) {
  const regex = /(^| +|\t+)(?!@)(\w+)/gm;
  return recipients.replace(regex, '$1@$2');
}

function findMentions(comment) {
  return comment.match(/(\B@(\w|-)+)/gi);
}

function correctMessage(message, recipients, label) {
  return message.replace('{recipients}', recipients).replace('{label}', label)
}

module.exports = { correctRecipients, findMentions, correctMessage };
