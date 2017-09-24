module.exports = function(){
  
  var express = require('express');
  var session = require('express-session');
  var app = express();
  var bodyParser = require('body-parser');
  var FileStore = require('session-file-store')(session);
  var OrientoStore = require('connect-oriento')(session);

  app.locals.pretty = true;
  app.set('view engine', 'jade');
  app.set('views', './views/orientdb');

  app.use('/user', express.static('uploads'));
  app.use(session({
    secret: 'fewonowavn;mdsd',
    resave: false,
    saveUninitialized: true,
    store: new OrientoStore({
      server: "host=localhost&port=2424&username=root&password=star3244&db=o2",
    }),
  }));

  app.use(bodyParser.urlencoded( {extended: false} ));

  return app;

}
