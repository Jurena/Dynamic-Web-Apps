# Basic Chatting 
### About 
This basic chatting app allows a user to run a live server wherein users can connect, first by registering a username, and then sent text to each other and, after a small bug fix, files to the server
### Installation Instructions
Pull repo, Using Node Js validate that all dependencies are properly installed, run using Node JS, cd to repo directory, run 'node app.js', and connect to chat using localhost:3000. 
### Dependancies List 
1. [Socket IO](https://www.npmjs.com/package/socket.io)
1. [Body Parser](https://www.npmjs.com/package/body-parser)
1. [Ejs](https://www.npmjs.com/package/ejs)
1. [Express](https://www.npmjs.com/package/express)
1. [Request](https://www.npmjs.com/package/request)
1. [Socket-IO-File](https://www.npmjs.com/package/socket.io-file)
1. [Socket-IO-File-Client](https://www.npmjs.com/package/socket.io-file)
### Known Bugs
Socket-IO-File is dependent on a form submission for the file to be uploaded, however because our chat app is form based, there seems to be a problem with how Socket-IO-File reads the form. The fix may be to edit the client JS from Socket-IO-File, will update once fixed. 
