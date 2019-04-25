"use strict";
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const express = require('express');
var counter = 0; 
const bodyParser = require('body-parser');
const request = require('request');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
const fs = require('fs');
let userInfo = fs.readFileSync('userInfo.json')
let db = JSON.parse(userInfo);
let username = null; //var for username, to be displayed when chatting
let userExists = false; //var for checking if user has logged in before
 // app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });
const SocketIOFile = require('socket.io-file');


//default page for server is signin page
app.get('/', function(req, res){
	res.render('sign-in', {err:null})
})
//Writes the user's username onto a JSON, passes that value 
//for when the user is chatting
app.post('/signin', function(req, res){
	username = req.body.username; 
	//loop through the contents of our DB to see if the user is a prior user
	Object.keys(db).forEach(function(username) {
  	if (db[username] === true) {
  		userExists=true; 
  		console.log(username + " Exists")
 		 }
	})
	if (userExists	== false){
		db[username] = true; 
		let userdata = JSON.stringify(db); 
		fs.writeFile('userInfo.json', userdata, finished);
		function finished(err){
			if (err){
				throw err; 
			}
			console.log(username + " has been logged");
		}
	}
	res.redirect('/index')
});


app.get('/index', function(req,res){
	if (username == null){
		res.render('sign-in', {err:"You must Login!"});
	}
	res.render('index');

});

//send the socket-io-file javascript over to our client
app.get('/server.js', (req, res, next) => {
	return res.sendFile(__dirname + '/views/public/server.js');
});

app.get('/socket.io-file-client.js', (req, res, next) => {
	return res.sendFile(__dirname + '/node_modules/socket.io-file-client/socket.io-file-client.js');
});



io.on('connection', function(socket){
	const room = 'private'

	console.log(username+ " has connected");
	if (userExists == true){
		io.emit('chat message', ("Welcome Back " + username)); 
	}
	else{
		io.emit('chat message', (username + " Has Joined"));
	}

	socket.on('disconnect', function() {
		io.emit('chat message', (username + " Has disconnected"))
	}); 

	socket.on('chat message', function(msg){
		if (msg.length > 0){
			msg = (username + ": " + msg)
		}
		else{
			msg = "";
		}
		console.log(msg); 
		io.emit('chat message', msg);
	});

	//create the uploader obj for when users upload files to the server
	var uploader = new SocketIOFile(socket, {
		uploadDir: 'data', 
	 // accepts: ['audio/mpeg', 'audio/mp3'],		// chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
		chunkSize: 10240,							// default is 10240(1KB)
		transmissionDelay: 0,						// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
		overwrite: false, 							// overwrite file if exists, default is true.

	});
	uploader.on('start', (fileInfo) => {
		console.log('Start uploading');
		console.log(fileInfo);
	});

	uploader.on('stream', (fileInfo) => {
		console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
	});
	uploader.on('complete', (fileInfo) => {
		console.log('Upload Complete.');
		console.log(fileInfo);
	});
	uploader.on('error', (err) => {
		console.log('Error!', err);
	});
	uploader.on('abort', (fileInfo) => {
		console.log('Aborted: ', fileInfo);
	});


}); 

	

http.listen(3000, function(){
  console.log('listening on port :3000');
});


