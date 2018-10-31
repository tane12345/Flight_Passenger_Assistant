var express=require('express');
var router=express.Router();
var unirest=require('unirest');
var flash=require('connect-flash');
var User=require('../model/schema');
var Flight=require('../model/flightinfo');

router.get('/',function(req,res){
	res.render('flight');
});


router.post('/search',function(req,resp){
	var flight_code=req.body.flight_code;
	var flight_number=req.body.flight_number;
	var year=req.body.year;
	var month=req.body.month;
	var day=req.body.day;
	var from=req.body.from;
	req.app.locals.from=from;


	var url='https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/'+flight_code+'/'+flight_number+'/dep/'+year+'/'+month+'/'+day+'?appId=9c8c18b1&appKey=fa9f824aa4b0be2767aac1159b5591a1&utc=false';
	console.log(url);

	var Request=unirest.get(url)
				.timeout(3000)
				.end(function(res){
					var response=res.raw_body;
					console.log(res.body);
					console.log(response);
					var obj=JSON.parse(response);
					if(obj["error"]){
						req.flash('error',obj.error.errorMessage);
						resp.redirect('/flight');
					}
					else{
						resp.redirect('/flight/details');
						req.app.locals.flight=obj;
					}
					
				});
	
});


router.get('/details',function(req,res){
	var flight=req.app.locals.flight;
	res.render('details',{flight:req.app.locals.flight,from:req.app.locals.from});
});

router.get('/add',function(req,res){
	if(!req.isAuthenticated()){
		req.flash('error','Login To Add Flights');
		res.redirect('/login');
	}
	else{
		var flight=req.app.locals.flight;
		var username=req.user.username;
		Flight.findOneAndUpdate({username:username}, {$push: {flight: flight}},function(err,data){
			req.flash('success','Flight Added to your flight history');
			res.redirect('/');
		});
	}
});

module.exports=router;
