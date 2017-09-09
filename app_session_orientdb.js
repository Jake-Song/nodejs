var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var OrientoStore = require('connect-oriento')(session);

app.use(session({
  secret: 'fewonowavn;mdsd',
  resave: false,
  saveUninitialized: true,
  store: new OrientoStore({
    server: "host=localhost&port=2424&username=root&password=star3244&db=o2",
  }),
}));
app.use(bodyParser.urlencoded( {extended: false} ));

app.get('/count', function(req, res){
  if(req.session.count){
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('Count: ' + req.session.count);
});

app.get('/auth/login', function(req, res){
  var output = `
    <h2>Log in</h2>
    <form action="/auth/login" method="POST">
      <p>
        <label for="username">Username</label>
        <input type="text" name="username" />
      </p>
      <p>
        <label for="password">Password</label>
        <input type="password" name="password" />
      </p>
      <input type="submit" value="Submit" />
    </form>
  `;
  res.send( output );
});

app.post('/auth/login', function(req, res){

  var user = {
    username: "egoing",
    password: '111',
    displayName: 'Jake',
  }

  var uname = req.body.username;
  var pwd = req.body.password;

  if( user.username == uname && user.password === pwd ){
    req.session.displayName = user.displayName;
    req.session.save(function(){
      res.redirect('/welcome');
    });
  } else {
    res.send('Who are you? <a href="/auth/login">Login</a>');
  }
});

app.get('/welcome', function(req, res){
  if( req.session.displayName ){
    res.send(
      `
        <h1>Hello, ${req.session.displayName}</h1>
        <a href="/auth/logout">Log Out</a>
      `
    );
  } else {
    res.send( `
      <h1>Welcome!<h1>
      <a href="/auth/login">Login</a>
    ` );
  }
});

app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  req.session.save(function(){
      res.redirect('/welcome');
  })
});

app.listen(3000, function(){
  console.log('3000 Port connected.');
});
