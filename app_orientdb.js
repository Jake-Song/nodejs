var express = require('express');
var app  = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage });

var OrientDB = require('orientjs');
var server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   'star3244'
});
var db = server.use('o2');

app.locals.pretty = true;
app.set('views', 'views_orientdb');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded( {extended: false} ));
app.use('/user', express.static('uploads'));

app.get('/upload', function(req, res){
  res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
  res.send('Upload Completed: ' + req.file);
});
app.get('/topic/add', function(req, res){
  var sql = 'SELECT FROM topic';
    db.query(sql).then(function(topics){

      res.render('add', {topics: topics});
    });
});
app.post('/topic/add', function(req, res){
  var title = req.body.title;
  var desc = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUES (:title, :description, :author)';
  db.query(sql, {
    params:{
      title: title,
      description: desc,
      author: author
    }
  }).then(function(results){
    res.redirect('/topic/' + encodeURIComponent(results[0]['@rid']));
  });
});
app.get('/topic/:id/edit', function(req, res){
  var sql = 'SELECT FROM topic';

  db.query(sql).then(function(topics){

    var id = req.params.id;
      var sql = 'SELECT FROM topic WHERE @rid=:rid';
      db.query(sql, { params:{ rid: id } }).then(function(topic){
          res.render('edit', {topics: topics, topic: topic[0]});
      });
  });
});
app.post('/topic/:id/edit', function(req, res){
  var sql = 'UPDATE topic SET title=:t, description=:d, author=:a WHERE @rid=:rid';
  var id = req.params.id;
  var title = req.body.title;
  var desc = req.body.description;
  var author = req.body.author;
  db.query(sql, {
    params:{
      t: title,
      d: desc,
      a: author,
      rid: id
    }
  }).then(function(topics){
    res.redirect('/topic/' + encodeURIComponent(id));
  });
});
app.get('/topic/:id/delete', function(req, res){
  var sql = 'SELECT FROM topic';

  db.query(sql).then(function(topics){

    var id = req.params.id;
      var sql = 'SELECT FROM topic WHERE @rid=:rid';
      db.query(sql, { params:{ rid: id } }).then(function(topic){
          res.render('delete', {topics: topics, topic: topic[0]});
      });
  });
});
app.post('/topic/:id/delete', function(req, res){
  var id = req.params.id;
  var sql = 'DELETE FROM topic WHERE @rid=:rid';
  db.query(sql, {
    params:{
      rid: id
    }
  }).then(function(results){
    res.redirect('/topic/');
  });
});
app.get(['/topic', '/topic/:id'], function(req, res){
  var sql = 'SELECT FROM topic';

  db.query(sql).then(function(topics){

    var id = req.params.id;
    if(id){
      var sql = 'SELECT FROM topic WHERE @rid=:rid';
      db.query(sql, { params:{ rid: id } }).then(function(topic){
          res.render('view', {topics: topics, topic: topic[0]});
      });
    } else {
      res.render('view', {topics: topics});
    }
  })
});

app.listen(3000, function(){
  console.log('Connected 3000 port.');
});
