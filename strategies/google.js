const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const auth = require('../index')
const config = auth.config

module.exports = new GoogleStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: config.authEndPoint + '/google/callback'
  },
  function(token, tokenSecret, profile, done) {
    profile.network = 'google'
    if(profile) return done(null, profile)
    return done(null, false)
  }
)
