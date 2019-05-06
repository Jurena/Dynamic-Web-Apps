//initialize all variables
const express = require('express');
const app = express(); 
require('dotenv').config()
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
const request = require('request');
app.set('view engine', 'ejs')
const admin = require("firebase-admin");
const serviceAccount = require(__dirname + "/Auth/serviceAccountKey.json"); //for firebase intergration
const port = 3000; 
app.listen(port);
console.log("Listening on Port ", String(port));
const GCivicAPI = process.env.GOOGLE_CONGRESS_API_KEY;
const ProAPI = process.env.PROPUBLICA_API_KEY; //not used
const GNewsAPI = process.env.GOOGLE_NEWS_API_KEY; 
const CurrentsAPI = process.env.CURRENTS_API; //not used, 10 request per day >:(
let street; 
let zipcode; 
let city; 
let state;
let userData = []; 
let address = null;
let newsdone = false; 

let Civic_url ='https://www.googleapis.com/civicinfo/v2/representatives?key='+GCivicAPI+ '&address='; 
//initialize the app
app.get('/', function(req,res){
	res.render('login', {error:null});	
})
//for serving images and custom font
app.use('/public/img/', express.static('public/img'));
app.use('/public/font/', express.static('public/font'));

/*when a user submits their information, the initialized 
variables get assigned, and a userData array is filled with 
objects (rep data) */
app.post('/signin', function(req,res){
	street = req.body.address; 
	zipcode = req.body.zip; 
	city = req.body.City; 
	state = req.body.State
	address = street + ' ' + city + ' ' + state; 
	address = removeWhiteSpace(address);
	createUserData(address);
	res.redirect('/index')
});
/*post call for when the In the News Button is clicked
checks if the action has already been done, if so the items 
are removed and the page goes back to its original state, 
otherwise the request gets made the the userdata objects get filled */
app.post('/fillNews', function(req,res){
	if (newsdone === true){
		newsdone = false; 
		for (let i=0; i<userData.length; i++){
			userData[i].stories = null
		}
		res.redirect('/index');
	}
	else{
		newRequest(); 
		console.log("Filling News Section");
		setTimeout(function(){res.redirect('/index')}, 1000);
	}
});
//set up the master address to be ready to make the google civic api call;
function removeWhiteSpace(strng){
	for (var i =0; i<strng.length; i++){
		strng = strng.replace(" ", "%20"); 
	}
	strng += "%20";
	return strng; 
}
/*makes a request to the Google News API based on a rep's name, 
makes a request for all reps in the array */ 
function newRequest(){
	newsdone=true; 
	let query; 
	for (let i =0; i<userData.length; i++){
		query = userData[i].name; 
		query = '"' + query +'"';
		let News_url = "https://newsapi.org/v2/everything?q="+query+"&sortBy=relevancy&apiKey="+GNewsAPI; 
		console.log(News_url);
		request(News_url, function(err, response, body){
			if (err){//error sending request
				console.log("Error in Google News API request");
				return;
			}
			else{
				let news = JSON.parse(body);
				if (news.status !== "ok"){ //error returned from request
					console.log("Request was recieved, error returned");
					console.log(news);
					return;
				} 
				else {
					//request successful, populate the headlines array with article titles and their corresponding URLs
					let headlines = []; 
					if (news.totalResults>=3){
						for (let ind=0; ind<3; ind++){
							headlines.push({
								title: news.articles[ind].title,
								url: news.articles[ind].url
							})
						}
					}
					else{
						for (let ind=0; ind<news.totalResults; ind++){
							headlines.push({
								title: news.articles[ind].title,
								url: news.articles[ind].url
							});
						}
					}
					console.log(headlines);
					console.log("===============================")
					userData[i].stories = headlines; 
				}
			}
		})
	}
	
}
/*fills the userData array with objects that contain information 
pulled from the Google Civic API */
function createUserData(address){
	Civic_url+= address;
	userData.length = 0; 
	newsdone = false; 
	console.log(Civic_url);
	request(Civic_url, function(err, response, body){
		if (err){ //error 
			return err; 
		}
		else { //error, request was fulfilled but it was undefined
			let congress = JSON.parse(body);
			if (congress.kind==undefined){
				console.log("The Congress object from the Google Civics API returned undefined :(");
				return err; 
			}
			else{
				//fill the userData object with references to data from the google civic info api
				let inds = congress.offices.length -1; 
				const length = congress.offices.length-1; 
				let theOffice;
				let theOfficial; 
				let theParty; 
				let phonenums; 
				let photo;
				let theEmail;
				let socmedia; 
				const party = " Party"; 
				while(inds >= (length-5)){
					theOffice = congress.offices[inds].name;  
					let i = congress.offices[inds].officialIndices.pop(); 
					theOfficial = congress.officials[i].name;
					theParty = congress.officials[i].party;
					if (typeof theParty !== 'undefined'){
						if (theParty.includes(party) === false){
							if (theParty !== "Nonpartisan"){
								theParty += party; 
							}
						}
					}
					phonenums= congress.officials[i].phones;
					if (typeof phonenums === 'undefined'){
						phonenums = [];
					}
					photo= congress.officials[i].photoUrl;
					theEmail = congress.officials[i].emails; 
					socmedia = congress.officials[i].channels; 
					console.log(socmedia);
					inds -=1;  
					userData.push({
						name: theOfficial,
						title: theOffice,
						party: theParty,
						phones: phonenums, 
						pic: photo, 
						email: theEmail,
						social: socmedia, 
						stories: null
					});
				}
			}
		}
	})
}

//master index page
app.get('/index', function(req,res){
	console.log(userData);
	if (userData.length === 0){
		res.redirect('login', {error:"Please Wait"});
	}
	res.render('index', {data:userData, error:null})
});
