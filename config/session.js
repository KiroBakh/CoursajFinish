const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("../config/db");

const ses = session({
  store: new pgSession({
    pool: pool,
    tableName: "sessions",
  }),
  secret: "PENIS",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3600 * 24 },
});

module.exports = ses;
