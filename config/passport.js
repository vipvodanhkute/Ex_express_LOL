var LocalStrategy = require('passport-local').Strategy;
var Users = require('../models/users');
var bcrypt = require('bcryptjs');
module.exports = function (passport) {
    passport.use(new LocalStrategy(function (username, password, done) {
        Users.findOne({ username: username }, function (err, user) {
            if (err) console.log(err);
            if(!user){
                return done(null,false,{message:'No user found!.'});
            }
            bcrypt.compare(password,user.password,function(err,isMath){
                if(err) console.log(err);
                if(isMath){
                    return done(null,user);
                }else{
                    return done(null,false,{message:'Wrong password!.'});
                }
            })
        });
    }));
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    passport.deserializeUser(function(id,done){
        Users.findById(id,function(err,user){
            done(err,user);
        });
    });
}