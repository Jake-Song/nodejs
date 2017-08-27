var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/form', function(req, res){
  res.render('form');
});
app.get('/form_receiver', function(req, res){
  var title = req.query.title;
  var desc = req.query.description;
  res.send(title + ', ' + desc);
});
app.post('/form_receiver', function(req, res){
  var title = req.body.title;
  var desc = req.body.description;
  res.send(title + ', ' + desc);
});
app.get('/topic', function(req, res){
  var topics = [
    'Java Script is..',
    'Node js is..',
    'Express is..'
  ];
  var output = `
    <a href="?id=0">Java Script</a><br>
    <a href="?id=1">Node js</a><br>
    <a href="?id=2">Express</a><br><br>
    ${topics[req.query.id]}
  `;
  res.send(output);
});
app.get('/topic/:id', function(req, res){
  var topics = [
    'Java Script is..',
    'Node js is..',
    'Express is..'
  ];
  var output = `
    <a href="0">Java Script</a><br>
    <a href="1">Node js</a><br>
    <a href="2">Express</a><br><br>
    ${topics[req.params.id]}
  `;
  res.send(output);
});
app.get('/topic/:id/:mode', function(req, res){
  res.send(req.params.id + ', ' + req.params.mode);
});
app.get('/template', function(req, res){
  res.render('temp', {time: Date(), _title: 'jade'});
});
app.get('/', function(req, res){
  res.send('Hello Home Page.');
});
app.get('/dynamic', function(req, res){
  var lis = '';
  for(var i = 0; i < 5; i++){
    lis += '<li>coding</li>';
  }
  var date = Date();
  var output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
    </head>
    <body>
        Hello, Dynamic!
        <ul>
          ${lis}
        </ul>
        ${date}
    </body>
    </html>
  `;
  res.send(output);
});
app.get('/login', function(req, res){
  res.send('Please Log in.');
});
app.get('/route', function(req, res){
  res.send('Hello, <img src="[NATURE REPUBLIC]  Aloe Vera Gel, 300ml, 10.56 Fluid Ounce.jpg" alt="" />');
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
