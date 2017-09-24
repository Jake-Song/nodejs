module.exports = function(){
  var OrientDB = require('orientjs');
  var server = OrientDB({
     host:       'localhost',
     port:       2424,
     username:   'root',
     password:   'star3244'
  });
  var db = server.use('tutorial');
  return db;
}
