var express=require('express');
var router=express.Router();
var passport=require('passport');
var User=require('../model/schema');
var LocalStrategy=require('passport-local').Strategy;
var bcrypt=require('bcryptjs');
var session=require('express-session');


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {

     	if (err) { return done(err); }
      	if (!user) {
        	return done(null, false, { message: 'Incorrect username.' });
      	}
      	if (user){
      		bcrypt.compare(password, user.password, function(err, res) {
				if(res==true){
					return done(null, user);
				}
				else{
					return done(null, false, { message: 'Incorrect password.' });
				}
			});
      	}      	
    });
  }
));

router.get('/',function(req,res){
	res.render('login');
});

router.post('/user', passport.authenticate('local', 
	{ failureRedirect: '/login',
  		failureFlash: 'Invalid username or password.',successFlash: 'Welcome!'}),function(req,res){
  req.app.locals.user=req.user;
  res.redirect('/');

});

module.exports=router;