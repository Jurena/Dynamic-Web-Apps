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
const serviceAccount = require(__dirname + "/Auth/serviceAccountKey.json");
const port = 3000; 
app.listen(port);
console.log("Listening on Port ", String(port));
let street; 
let zipcode; 
let city; 
let state; 
let name; 

//initialize the app
app.get('/', function(req,res){
	res.render('login');	
})
//Initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stay-engaged.firebaseio.com"
});
//Create referene to firebase DB
var db = admin.database(); 
var ref = db.ref('Addresses');
//write data to firebase DB
var usersRef = ref.child('users');

app.post('/signin', function(req,res){
	street = req.body.address; 
	zipcode = req.body.zip; 
	city = req.body.City; 
	state = req.body.State

	usersRef.set({
			Street: street, 
			ZipCode: zipcode, 
			City: city, 
			State: state, 
	});
})
