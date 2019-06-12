var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session= require('express-session');
var expressValidator= require('express-validator');
var fileUpload=require('express-fileupload');
//var logger = require('morgan');
var database=require('./config/database');
var mongoose=require('mongoose'); 
var passport = require('passport');
var adminTags=require('./routes/admin_tags');
var adminChampions=require('./routes/admin_champions');
var adminUsers=require('./routes/admin_users');
var app = express();
var port = 3000;
// Connect to db
mongoose.connect(database.database);
var db=mongoose.connection;
db.on('error',console.error.bind(console, 'connection error'));
db.once('open',function(){
  console.log('Connect to MongoDB')
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {  
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  },
  customValidators: {
    isImage: function (value, filename) {
      var extension = (path.extname(filename)).toLowerCase();
      console.log(extension);
      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        case '':
          return '.jpg';
        default :
        return false;
      }
    }
  }
}));
// message 
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// session
app.use(session({
  secret: 'keyboard cat',
  resave: true,//false
  saveUninitialized: true,
  //cookie: { secure: true }
}));
// passport 
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
// fileUpload
app.use(fileUpload());
// Khai bao globa
// app.get('*',function(req,res,next){
//   //res.locals.cart=req.session.cart;
//   res.locals.user=req.user || null; 
//   next();
// })
app.use((req,res,next)=>{
  //res.locals.success_msg=req.flash('success_msg');
  res.locals.user=req.user || null
  next();
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin/tags', adminTags);
app.use('/admin/champions',adminChampions);
app.use('/admin/users',adminUsers);

app.locals.errors=null;
app.listen(port, function () {
  console.log('Server started on port ' + port);
});
