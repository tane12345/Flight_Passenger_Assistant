var express=require('express');
var router=express.Router();
var nodemailer=require('nodemailer');
var User=require('../model/schema');
var Flight=require('../model/flightinfo');
var bcrypt=require('bcryptjs');
var flash=require('connect-flash');
var accountSid = 'AC13bacb88f1633b1b5068e89e2eb54520';
var authToken = '3ea96c68915917be88fc50c4f93ef857';
var salt=10;
var client = require('twilio')(accountSid, authToken);


router.get('/',function(req,res){
	res.render('signup',{name:'',number:'',email:'',username:'',password:''});
});

router.post('/user',function(req,res){
	var name=req.body.name;
	var number=req.body.number;
	var email=req.body.email;
	var username=req.body.username;
	var password=req.body.password;

	User.findOne({username:username},function(err,data){
		console.log(data);
		if(data!=null){
			req.flash('error','User with this username already exists. Pick another one');
			res.location('/signup');
			res.render('signup',{name:name,number:number,email:email,username:'',password:''});
		}
		else{
			bcrypt.hash(password,salt,function(err,hash){
				password=hash;
				var item={name:name,number:number,email:email,username:username,password:password,otp:otp};
				req.app.locals.username=username;
				var newflightuser=new Flight({username:username,flight:[]});
				newflightuser.save();
				var newUser=new User(item);
					newUser.save(function(err,data,numAffected){
					//console.log("Data Inserted: "+numAffected);
				});
			});
			var otp=code();
			client.messages.create({
  				to: "+91"+number,
  				from: "+18327427611",
  				body: 'Hi! Now you have to enter this OTP to register'+' '+'OTP:'+otp
			});

			var transport = nodemailer.createTransport({
        		service: 'Gmail',
        		auth: {
            		user: 'tanmaysanjay.gupta2015@vit.ac.in',
            		pass: 'flightassistant'
        		}
    		});

    		var mailOptions = {
        		from: 'FreeSlots <vitfreeslots@gmail.com>',
        		to: email,
        		subject: 'Successfully Registered',
        		text: 'U have got a new User',
        		html:
        		"<div style='width:80%; background-color:#004D40;border-radius:5px;padding:20px;color:white'>Thankyou! for registering on FlightAssistant. We hope that you like our services. Please provide us feedback. Your OTP is : "+otp+"</div>"
    		};


    		transport.sendMail(mailOptions, function (error, info) {
    			console.log("Mail has been sent!!!");
    		});
    		res.redirect('/signup/otp');

		}
	});

});

router.get('/otp',function(req,res){
	res.render('otp');
});

router.post('/checkotp',function(req,res){

	var username=req.app.locals.username;
	var otp=req.body.otp;
	User.findOne({username:username},function(err,data){
		// if(data.otp==otp){

			req.flash('success','Your account has been created successfully');
			res.redirect('/login');
		//}
		// else{
		// 	req.flash('error','Otp entered was not correct. So signup again');
		// 	res.redirect('/');
		// 	User.remove({username:username},function(err,docs){
		// 		console.log('User account has been removed');
		// 	});
		// }
	});
});

function code(){
	return Math.floor(Math.random()*900000) + 100000;
}

module.exports=router;
