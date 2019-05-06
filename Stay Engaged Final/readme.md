## Final Project: Stay Engaged
### About
Stay Engaged is a Node based project to help people understand who their representatives are. The inspiration for the project was from seeing the energy of the 2018 Midterm Congressional elections, I wanted help people understand that their state representatives and officials in particular are just as, if not more, important than our representatives in D.C. Using the Google Civic API, along with the News API, information basic biographic information about your (in-theory) most local to least local representatives is showcased.  
### How To Use 
The dependencies required to run this are:
1. [dotenv](https://www.npmjs.com/package/env)
1. [body-parser](https://www.npmjs.com/package/body-parser)
1. [ejs](https://www.npmjs.com/package/ejs)
1. [express](https://www.npmjs.com/package/express)
1. [firebase](https://www.npmjs.com/package/firebase)
1. [firebase-admin](https://www.npmjs.com/package/firebase-admin)
1. [request](https://www.npmjs.com/package/request)

Along with the following APIs: 
1. [Google Civic Information API](https://developers.google.com/civic-information/)
1. [News API](https://newsapi.org/)

Once all APIs and dependencies are installed, create a .env file and initialize the following: 
```
GOOGLE_CONGRESS_API_KEY=[YOUR KEY HERE]
PROPUBLICA_API_KEY=[YOUR KEY HERE]
GOOGLE_NEWS_API_KEY=[YOUR KEY HERE]
CURRENTS_API = [YOUR KEY HERE]
```
### Known Bugs
Client Side: yt.svg does not display, thus links to representatives' youtube pages are not displayed. 
Server Side: Four variables initialized but never used, may use later. 
``` javascript
const ProAPI = process.env.PROPUBLICA_API_KEY; //not used
const CurrentsAPI = process.env.CURRENTS_API; //not used, 10 request per day >:(
const admin = require("firebase-admin");
const serviceAccount = require(__dirname + "/Auth/serviceAccountKey.json"); //for firebase intergration
```

### Future Development 
Future work I'd like to do on this tool below: 
1. Revamp codebase for the index page, have it all be written under one loop
2. Fix Youtube icon bug
3. Revamp news without calling the News API, would rather pull Google News search data 
3. Incorporate Express session for unique user sessions
4. Log news data to firebase, pull news data rather than making a new request 
#### Credits
Youtube Icon Made by [Pixel perfect](https://www.flaticon.com/authors/pixel-perfect) from [flaticon](https://www.flaticon.com) Licensed by [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/)

Facebook Icon Made by [Freepik](https://www.freepik.com) from [flaticon](https://www.flaticon.com) Licensed by [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/)

Twitter Icon Made by [Elegant Themes](https://www.flaticon.com/authors/elegant-themes) from [flaticon](https://www.flaticon.com) Licensed by [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/)
[Bootstrap](https://getbootstrap.com/)

