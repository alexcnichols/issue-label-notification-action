const { correctRecipients, findMentions, correctMessage } = require('./utils');

test('changes nothing when configuration is correct', () => {
  const complexInput = `@docs-team @docs-team
  @docs-team @docs-team
  @docs-team @docs-team
  @docs-team @docs-team
  @docs-team  @docs-team
  @docs-team		@docs-team`;

  expect(correctRecipients(complexInput)).toBe(complexInput);
  expect(correctRecipients('@docs-team')).toBe('@docs-team');
  expect(correctRecipients('@1234')).toBe('@1234');
});

test('adds missing ambersands', () => {
  const input = `@docs-team docs-team
  docs-team @docs-team
  docs-team docs-team
  @docs-team @docs-team
  @docs-team  docs-team
  @docs-team		docs-team
  1234 @1234`

  const output = `@docs-team @docs-team
  @docs-team @docs-team
  @docs-team @docs-team
  @docs-team @docs-team
  @docs-team  @docs-team
  @docs-team		@docs-team
  @1234 @1234`;

  expect(correctRecipients(input)).toBe(output);
});

test('formats message when configuration is correct', () => {
  const input = 'Heads up {recipients} - the "{label}" label was applied to this issue.';
  const recipients = '@docs-team @1234';
  const label = 'documentation';

  const output = 'Heads up @docs-team @1234 - the "documentation" label was applied to this issue.';

  expect(correctMessage(input, recipients, label)).toBe(output);
});

test('corrects recipients when no recipients to suppress', () => {
  const recipients = `@docs-team @1234`;
  var recipientsToSuppress;

  expect(correctRecipients(recipients, recipientsToSuppress)).toBe(recipients);
});

test('corrects recipients when no recipients to suppress as an array', () => {
  const recipients = `@docs-team @1234`;
  const recipientsToSuppress = [];

  expect(correctRecipients(recipients, recipientsToSuppress)).toBe(recipients);
});

test('corrects recipients when 1 recipient to suppress', () => {
  const recipients = `@docs-team @1234`;
  var recipientsToSuppress = ['@1234'];
  const expectedRecipients = `@docs-team \`@1234\``;

  expect(correctRecipients(recipients, recipientsToSuppress)).toBe(expectedRecipients);
});

test('corrects recipients when 1 recipient to suppress with missing amp', () => {
  const recipients = `@docs-team @1234`;
  var recipientsToSuppress = ['1234'];
  const expectedRecipients = `@docs-team \`@1234\``;

  expect(correctRecipients(recipients, recipientsToSuppress)).toBe(expectedRecipients);
});

test('cleared recipients when all 2 recipients suppressed', () => {
  const recipients = `@docs-team @1234`;
  var recipientsToSuppress = ['@docs-team', '@1234'];
  const expectedRecipients = ``;

  expect(correctRecipients(recipients, recipientsToSuppress)).toBe(expectedRecipients);
});

test('formats message when configuration is correct and 1 recipient to suppress', () => {
  const input = 'Heads up {recipients} - the "{label}" label was applied to this issue.';
  const recipients = '@docs-team @1234';
  const label = 'documentation';
  var recipientsToSuppress = ['1234'];

  const output = 'Heads up @docs-team `@1234` - the "documentation" label was applied to this issue.';
  const correctedRecipients = correctRecipients(recipients, recipientsToSuppress);

  expect(correctMessage(input, correctedRecipients, label)).toBe(output);
});

test('find 1 mention in description', () => {
  const description = `Hello world cc: @1234 This is a new issue`;
  const expectedMentions = ["@1234"];

  expect(findMentions(description)[0]).toBe(expectedMentions[0]);
  expect(findMentions(description).length).toBe(1);
});

test('find 1 mention in description without space', () => {
  const description = `Hello world cc:@1234 This is a new issue`;
  const expectedMentions = ["@1234"];

  expect(findMentions(description)[0]).toBe(expectedMentions[0]);
  expect(findMentions(description).length).toBe(1);
});

test('find 2 mentions in description', () => {
  const description = `Hello world cc: @docs-team @1234 This is a new issue`;
  const expectedMentions = ["@docs-team", "@1234"];

  expect(findMentions(description)[0]).toBe(expectedMentions[0]);
  expect(findMentions(description)[1]).toBe(expectedMentions[1]);
  expect(findMentions(description).length).toBe(2);
});

test('ignore email as mention in description', () => {
  const description = `Hello world cc: hello@docs-team.com @1234 This is a new issue`;
  const expectedMentions = ["@1234"];

  expect(findMentions(description)[0]).toBe(expectedMentions[0]);
  expect(findMentions(description).length).toBe(1);
});
