module.exports = function(app){

  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var db = require('./db')();
  
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);

    var sql = 'SELECT * FROM user WHERE authId= :authId';
    db.query(sql, {params: { authId:id } }).then(function(results){
      if(results.length === 0){
        done('there is no user.');
      } else {
        done(null, results[0]);
      }
    });

  });

  passport.use(new LocalStrategy(
    function(username, password, done){
        var uname = username;
        var pwd = password;

        var sql = 'SELECT * FROM user WHERE authId = :authId';
        db.query(sql, { params: { authId: "local:" + uname } }).then(function(results){
          if( results.length === 0 ){
            done( null, false );
          }

          var user = results[0];

          return hasher({password: pwd, salt: user.salt}, function(err, pass, salt, hash){
            if( hash === user.password ){
              console.log('LocalStrategy', user);
              done(null, user);
            } else {
              done(null, false);
            }
         });

        });

      }
  ));

  passport.use(new FacebookStrategy({
      clientID: '1732964370110628',
      clientSecret: 'e074e79a4737e6e6b051f3f1bad8f566',
      callbackURL: "/auth/facebook/callback",
      profileFields: ['id', 'email', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      var authId = 'facebook:' + profile.id;

      var sql = 'SELECT * FROM user WHERE authId = :authId';
      db.query(sql, {params:{authId:authId}}).then(function(results){
        if(results.length === 0){
          var newUser = {
            'authId': authId,
            'displayName': profile.displayName,
            'email': profile.emails[0].value,
          };
          var sql = 'INSERT INTO user (authId, displayName, email) VALUES (:authId, :displayName, :email)';
          db.query(sql, {params: newUser}).then(function(results){
            done(null, results[0]);
          }, function(error){
            console.log(error);
          });
        } else {
          done(null, results[0] );
        }

      });

    }
  ));

  return passport;
}
