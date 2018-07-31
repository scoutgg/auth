const jwt = require('jwt-simple')
const moment = require('moment')
const auth = require('../index')
const config = auth.config

module.exports = function local(req, res, next) {
  auth.social(req, res, next).then((data)=> {
    // case of redirecting on starpick
    if(res.headersSent) return res.end()
    let payload = {
      iss: config.issuer,
      aud: config.audience,
      exp: +moment.utc().add((config.expiry || 3600),(config.expiryUnit || 'hour')).format('X')
    }
    payload = Object.assign({}, data, payload)
    const token = jwt.encode(payload, config.secretOrKey)
    const endpoint = req.socialRedirectOverride || config.socialRedirect
    const append = endpoint.includes('?')
    const url = `${endpoint}${append ? '&' : '?'}token=${token}&network=${payload.network}&socialId=${payload.socialId}`
    res.redirect(url)
  })
}
