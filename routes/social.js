const jwt = require('jwt-simple')
const moment = require('moment')
const auth = require('../index')
const config = auth.config

module.exports = function local(req, res, next) {
  auth.social(req, res, next).then((data)=> {
    let payload = {
      iss: config.issuer,
      aud: config.audience,
      exp: +moment.utc().add((config.expiry || 3600),(config.expiryUnit || 'hour')).format('X')
    }
    payload = Object.assign({}, data, payload)
    const token = jwt.encode(payload, config.secretOrKey)
    const endpoint = config.socialRedirect
    const append = endpoint.includes('?')
    const url = `${endpoint}${append ? '&' : '?'}token=${token}`
    console.log('redirect time', url)
    res.redirect(url)
  })
}
