const FacebookStrategy = require('passport-facebook').Strategy
const auth = require('../index')
const config = auth.config

module.exports = new FacebookStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.authEndPoint + '/facebook/callback',
  profileFields: ['id', 'emails', 'name'],
}, function(accessToken, refreshToken, profile, done) {
  profile.network = 'facebook'
  if(profile) return done(null, profile)
  return done(null, false)
})
