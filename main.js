const Jsdom = require('jsdom').JSDOM
const request = require('request-promise-native')
const moment = require('moment')
const _ = require('lodash')
const log = require('./logger')

const config = require('./config')
const emails = require('./email')

// Time in seconds
const HEARTBEAT_TIME = 60 * 24
const TICK_TIME = 1

const MOMENT_FORMAT = 'MMM Do YY, h:mm:ss'


function serializeMeta(meta) {
  const timestamps = _.mapValues(meta.timestamps, timestamp =>
    moment(timestamp).format(MOMENT_FORMAT)
  )
  return {
    availableSeats: meta.availableSeats,
    timestamps,
  }
}

// Checks the website for available seats
// @returns {Number} (capacity) - (current registration)
async function getAvailableSeats() {
  return Promise.all(config.links.map(async link => {
    const html = await request(link.url)

    const document = new Jsdom(html).window.document

    const capacity = document.querySelector(link.capacity_selector).innerHTML
    const actual = document.querySelector(link.actual_selector).innerHTML
    log(`Fetched data; the result is ${capacity - actual}`)

    return parseInt(capacity) - parseInt(actual)
  }))
}

function updateMeta(meta, currentTime, seats) {
  let func = () => new Promise(resolve => resolve(false))
  meta.lastCheck = currentTime
  if (_.isEqual(seats, meta.availableSeats)) {
    // If the last email was sent over a day ago
    if (currentTime - meta.lastEmail > 1000 * HEARTBEAT_TIME) {
      func = () => emails.heartbeat(serializeMeta(meta))
    }
  } else {
    meta.availableSeats = seats
    func = () => emails.freeSeats(serializeMeta(meta))
    meta.timestamps.lastChange = currentTime
  }
  return func
}

function main(tickTime) {
  // This is an object so we can pass it by reference
  const meta = {
    timestamps: {
      lastEmail: undefined,
      lastChange: undefined,
      lastCheck: undefined,
    },
    availableSeats: [],
  }

  const runner = async function() {
    try {
      const seats = await getAvailableSeats()
      const func = updateMeta(meta, new Date(), seats)
      const response = await func()
      if (response !== false) {
        meta.timestamps.lastEmail = new Date()
      }
      setTimeout(runner, tickTime * 1000)
    } catch(err) {
      log(err)
    }
  }

  runner()
}

main(TICK_TIME)
