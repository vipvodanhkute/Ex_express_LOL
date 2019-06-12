var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var Users=require('../models/users');

/* GET users listing. */
router.get('/',function(req,res){
  Users.find({},function(err,users){
    res.render('admin/users',{
      title:'USERS',
      users:users
    })
  })
})
/* GET register */
router.get('/register',function(req, res) {
  res.render('admin/register',{
    title:'Register'
  });
}); 
/* POST register */
router.post('/register',function(req,res){
  req.checkBody('name','Name must have a value!.').notEmpty();
  req.checkBody('username','UserName must hava a value!.').notEmpty();
  req.checkBody('password','Password must hava a value!.').notEmpty();
  req.checkBody('password2','ConfirmPassword do not match!.').equals(req.body.password);
  var errors=req.validationErrors();
  if(errors){
    res.render('admin/add_user',{
      user:null,
      title:'Add User',
      errors:errors
    });
  }else{
    Users.findOne({username:req.body.username},function(err,user){
      if(err) console.log(err);
      if(user){
        req.flash('danger','User exits, please choose another!.');
        res.render('admin/add_user',{
          title:'Add User'
        })
      }else{
        var user=new Users({
          name:req.body.name,
          username:req.body.username,
          password:req.body.password,
          admin:0
        });
        bcrypt.genSalt(10,function(err,salt){
          bcrypt.hash(user.password,salt,function(err,hash){
            if(err) console.log(err);
            user.password=hash;
            user.save(function(err){
              if(err){
                console.log(err);
              }else{
                req.flash('success','You are now registered!.');
                res.redirect('/admin/users/login');
              }
            });
          });
        });
      }
    });
  }
});
/* GET login */
router.get('/login',function(req,res){
  if(res.locals.user) res.redirect('/admin/champions');
  res.render('admin/login',{
    title:'Login'
  })
})
/* POST login */
router.post('/login',function(req,res,next){
  passport.authenticate('local',{
      successRedirect:'/admin/champions',  
      failureRedirect:'/admin/users/login',
      failureFlash:true,
  })(req,res,next);
});
router.get('/logout',function(req,res,next){
  req.logout();
  req.flash('success','You are logged out!');
   res.redirect('/admin/users/login');
})
module.exports = router;
