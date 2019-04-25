/* This program will read a users address and give them information 
about who their local representatives are*/
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const argv = require('yargs').argv;
const apiKey = process.env.API_KEY;
let port = process.env.PORT || 8080; 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.listen(port, function(){
	console.log("listening on port ", String(port));
})
var address = null; 
var city = null;
var state = null; 
let url = null; 
var congress; 
var data = {
	office7: null, 
	office4: null, 
	office5: null, 
	office6: null, 
	office1: null, 
	office3: null, 
	office2: null, 
}
const fs = require('fs'); 
let userInfo = fs.readFileSync('userInfo.json');
var db = JSON.parse(userInfo); 

app.get('/', function (req, res) {
  res.render('login');
})


function removeWhiteSpace(strng){
	for (var i =0; i<strng.length; i++){
		strng = strng.replace(" ", "%20"); 
		console.log(strng);
	}
	strng += "%20"
	return strng; 
}
app.post('/signin', function(req, res){
	let user = req.body.username; 
	let pass = req.body.password; 
	db[user] = pass; 
	let userdata = JSON.stringify(db); 
	fs.writeFile('userInfo.json', userdata, finished);
	function finished(err){
		if (err){
			throw err; 
		}
		console.log('The user has been logged');
		res.redirect('/index');
	}
})
app.get('/index', function(req,res){
	res.render('index',{message:null, error:null})
})
app.post('/addSub', function(req, res){
	address = req.body.address; 
	city = req.body.city; 
	state = req.body.state; 
	// console.log(address + " " + city + " " + state);
	address += city; 
	address += state; 
	console.log(address); 
	address = removeWhiteSpace(address);
	let url ='https://www.googleapis.com/civicinfo/v2/representatives?key='+apiKey+ '&address='+address; 

	request(url, function(err, response, body){
		if (err){
			res.render('index', {message:null, error: 'Error, please try again'})
		} else {
			congress = JSON.parse(body); 
			if (congress.kind==undefined){
				res.render('index', {message:null,error:'Error, please try again'});
			} else {
				//congress.officess holds their office name and .official holds
				//the persons name
				data.office7 = congress.offices[3].name + ": " + congress.officials[4].name;
				data.office4 = congress.offices[4].name + ": " + congress.officials[5].name; 
				data.office5 = congress.offices[5].name + ": " + congress.officials[6].name; 
				data.office6 = congress.offices[6].name + ": " + congress.officials[7].name;
				data.office1 = congress.offices[7].name + ": " + congress.officials[8].name; 				
				data.office2 = congress.offices[8].name + ": " + congress.officials[9].name; 
				data.office3 = congress.offices[9].name + ": " + congress.officials[10].name;
				let Message = Object.values(data); 
				console.log(Message);
				res.render('index', {message: Message, error: null});
			}
		}
	});
})

