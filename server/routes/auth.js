const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get(
  '/auth/google', 
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/auth/google/callback', 
  passport.authenticate('google'), 
  (req, res) => {
    res.redirect('/blogs');
  }
);

router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/api/current_user', (req, res) => {
  res.json(req.user);
});

module.exports = router;