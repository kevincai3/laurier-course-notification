const Mailgun = require('mailgun-js')
const config = require('./config')
const decamelize = require('decamelize')
const _ = require('lodash')
const log = require('./logger')

const mailgun = Mailgun({
  apiKey: config.mailgun.apikey,
  domain: config.mailgun.domain,
})

const templates = {
  heartbeat: serializedMeta => `This is to notify that this service is still running.
    Last email sent at ${serializedMeta.timestamps.lastEmail}.
    Last change was at ${serializedMeta.timestamps.lastChange}.
    Last time checked was as ${serializedMeta.timestamps.lastCheck}.
    And then current available seats is ${serializedMeta.availableSeats}.`
    ,
  freeSeats: serializedMeta => `This is to notify you that there are ${serializedMeta.availableSeats} seats available as of ${serializedMeta.timestamps.lastCheck}`
}

function sendEmails(content, header) {
  log(content, header)
  return new Promise((resolve, reject) => {
    mailgun.messages().send({
      from: config.mailgun.from,
      to: config.targets.join(','),
      subject: `Laurier Course Alerter For BU493 - ${header}`,
      text: content,
    }, (err, body) => {
      if (err) return reject(err)
      return resolve(body)
    })
  })
}

// Converts all the templates into calls of sendEmail, content being the result of the template called with the passed in argument, and the header being the key of the template converted from camel case to Regular Form.
const templateFunctions = _.mapValues(templates, (template, name) => {
  return (meta) => {
    return sendEmails(
      template(meta),
      decamelize(name, ' ')
        .split(' ')
        .map(word => (word[0].toUpperCase() + word.substr(1)))
        .join(' ')
    )
  }
})

module.exports = templateFunctions
