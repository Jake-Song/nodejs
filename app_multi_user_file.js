var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session);
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

app.use(session({
  secret: 'fewonowavn;mdsd',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
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

var users = [
  {
    username: "egoing",
    password: 'maMqs8u9oZ6p4MnSmjTO3qTqDL18yzh1jvGzk0idHyojTG0BdKLp+ZP0tBaFi/O+1rjoyfjgNJe3TOpK5BayPoxdPem3pcXkSOchmI0jxNsZCEbIylGeyWw7OP42etRCvDJJ5qS6LJPykicgryfLo2TiJw/jfNbiMty251acW8E=',
    displayName: 'Jake',
    salt: 'rUNP/woOyEjLdojlsbjx+3RA394CUb7t9knfs3r1n7HCrq0SrggoHL17NTJHQkK38DL/GwzRY1S7cyHo9TWUqg==',
  },
];

app.post('/auth/login', function(req, res){

  var uname = req.body.username;
  var pwd = req.body.password;

  for( var i = 0; i < users.length; i++ ){
    var user = users[i];

    if(uname === user.username){

      return hasher({password: pwd, salt: user.salt}, function(err, pass, salt, hash){
        if( hash === user.password ){
          req.session.displayName = user.displayName;
          req.session.save(function(){
            res.redirect('/welcome');
          });
        } else {
          res.send('Invalid password. <a href="/auth/login">Login</a>');
        }
     });
    }
  }

  res.send('Who are you? <a href="/auth/login">Login</a>');

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
      <ul>
        <li><a href="/auth/register">Register</a></li>
        <li><a href="/auth/login">Login</a></li>
      </ul>
    ` );
  }
});

app.get('/auth/register', function(req, res){
  var output = `
    <h2>Register</h2>
      <form action="/auth/register" method="POST">
        <p>
          <label for="username">Username</label>
          <input type="text" name="username" />
        </p>
        <p>
          <label for="password">Password</label>
          <input type="password" name="password" />
        </p>
        <p>
          <label for="displayName">Display Name</label>
          <input type="text" name="displayName" />
        </p>
        <input type="submit" value="Submit" />
      </form>
  `;
  res.send(output);
});

app.post('/auth/register', function(req, res){
  hasher({password: req.body.password}, function(err, pass, salt, hash){
    var user = {
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName
    };
    users.push(user);
    req.session.displayName = req.body.displayName;
    req.session.save(function(){
      res.redirect('/welcome');
    });
  });
});

app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  req.session.save(function(){
    res.redirect('/welcome');
  });
});

app.listen(3000, function(){
  console.log('3000 Port connected.');
});
