const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require("passport");
const keys = require('./configs/keys');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
require('./services/passport');
require('./services/cache');

const app = express();

app.use(express.json());
app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);
app.use('/', blogRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
mongoose.connect(keys.mongoURI)
.then(() => {
  app.listen(port, () => {
    console.log(`Listening on port`, port);
  });
})
.catch((error) => {
  console.log("Could not connect to DB:", error)
});