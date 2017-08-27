var OrientDB = require('orientjs');

var server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   'star3244'
});
var db = server.use('o2');
/*
var rec = db.record.get('#19:0')
   .then(
      function(record){
         console.log('Loaded Record:', record);
       }
   );
*/
// create
/*
var sql = 'SELECT FROM topic';
db.query(sql).then(function(result){
  console.log(result);
})
*/
/*
var sql = 'SELECT FROM topic WHERE @rid=:rid';
var param = {
  params:{
    rid: '#19:0'
  }
};
db.query(sql, param).then(function(result){
  console.log(result);
});
*/

// insert
/*
var sql = 'INSERT INTO topic (title, description) VALUES (:title, :description)';
var param = {
  params:{
    title: 'Express',
    description: 'Express is framework for web'
  }
};
db.query(sql, param).then(function(results){
  console.log(results);
});
*/

// update
/*
var sql = 'UPDATE topic SET description=:description WHERE @rid=:rid';
db.query(sql, {params:{
  description: 'Express is the framework for web',
  rid: '#18:1' }}).then(function(results){
    console.log(results);
  });
*/

// delete
var sql = 'DELETE FROM topic WHERE @rid=:rid';
db.query(sql, {params:{rid: '#19:1'}}).then(function(results){
  console.log(results);
});
