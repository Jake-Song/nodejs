var app = require('./config/orientdb/express')();
var passport = require('./config/orientdb/passport')(app);

app.get('/welcome', function(req, res){
  if( req.user && req.user.displayName ){
    res.send(
      `
        <h1>Hello, ${req.user.displayName}</h1>
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

var auth = require('./routes/orientdb/auth')( passport );
app.use('/auth', auth);

app.listen(3000, function(){
  console.log('3000 Port connected.');
});
