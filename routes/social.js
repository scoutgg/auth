const jwt = require('jwt-simple')
const moment = require('moment')
const auth = require('../index')
const config = auth.config

module.exports = function local(req, res, next) {
  auth.social(req, res, next).then((data)=> {
    let payload = {
      iss: config.issuer,
      aud: config.audience,
      exp: +moment.utc().add((config.expiry || 3600),'hour').format('X')
    }
    payload = Object.assign({}, data, payload)
    let token = jwt.encode(payload, config.secretOrKey)
    let endpoint = req.query.success || '/'
    let url = `${endpoint}?token=${token}`
    res.redirect(url)
  })
}
