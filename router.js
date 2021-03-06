const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const FbStrategy = require('passport-facebook').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('./index').config
const express = require('express')
const passport = require('passport')

module.exports = function() {
  const router = express.Router()

  passport.use('jwt', require('./strategies/jwt'))
  passport.use('local', require('./strategies/local'))
  if(config.facebook) {
    passport.use('facebook', require('./strategies/facebook'))
  }
  if(config.google) {
    passport.use('google', require('./strategies/google'))
  }

  const auth = {
    jwt: passport.authenticate('jwt', {session: false}),
    local: passport.authenticate('local', {session: false}),
    facebook(req, res, next) {
      let uri = `/facebook/callback?success=${encodeURIComponent(req.query.success || '/')}`
      passport.authenticate('facebook', {
        callbackURL: (req.authEndPointOverride || config.authEndPoint) + uri,
        scope: config.facebook.scope,
        session: false,
        failureRedirect: req.query.failure || '/'
      })(req, res, next)
    },
    google(req, res, next) {
      let uri = `/google/callback`
      passport.authenticate('google', {
        session: false,
        callbackURL: (req.authEndPointOverride || config.authEndPoint) + uri,
        scope: ['email'],
      })(req, res, next)
    }
  }

  router
    .use(passport.initialize())
    // Local routes
    .post('/register', require('./routes/create'))
    .post('/login', require('./routes/login'))
    .post('/refresh', require('./routes/refresh'))
    .post('/reset/:token', require('./routes/reset'))
    .get('/forgot/:email', require('./routes/forgot'))
    .get('/', auth.jwt, require('./routes/profile'))
    // Social logins
  if(config.facebook) {
    router
      .get('/facebook', auth.facebook, require('./routes/create'))
      .get('/facebook/callback', auth.facebook, require('./routes/social'))
  }
  if(config.google) {
    router
      .get('/google', auth.google, require('./routes/create'))
      .get('/google/callback', auth.google, require('./routes/social'))
  }

  return router
}
