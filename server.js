//var ig = require('instagram-node').instagram();
//
//// Every call to `ig.use()` overrides the `client_id/client_secret`
//// or `access_token` previously entered if they exist.
//ig.use({ access_token: '3124938444.24857ab.6956e397931d4637a4d5697eaf8acd14' });
////ig.use({ client_id: '24857ab4250942db92380612d3946ae6',
////         client_secret: 'ae9280d092cd4fe88bacdf5a713f060c' });
//

var request = require('request');
var cheerio = require('cheerio');

var config = require('./config.json');
console.log(config.ds_user_id);

var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}
var notif;
var lastTime = Date.now();
var currentTime;
var j = request.jar();
request = request.defaults({jar:j});
j.setCookie(request.cookie('ds_user_id=' + config.ds_user_id), 'https://www.instagram.com/');
j.setCookie(request.cookie('sessionid=' + config.sessionid), 'https://www.instagram.com/');

function getNotif() {
  request.get({
    url: 'https://www.instagram.com/accounts/activity/?__a=1',
  }, function(error, response, body) {
    notif = JSON.parse(body).activityFeed.stories;
    console.log('retrieved json');
    loop();
  });
  
}

function loop() {
  
  currentTime = Date.now(); //time at beginning of calculations
  for (i in notif) {
    if (notif[i].timestamp > lastTime/1000) { //grabs notifications newer than lastTime
      var text = '';
      var mediaID = '';
      
      //grab data
      try {
        text = notif[i].text;
        mediaID = notif[i].media.id.slice(0,18); //concatenate mediaID
      } catch (err) {
        console.log('error grabbing attributes: '); //most likely trying to grab text from a follow notification
      }
      
      console.log(text + ', ' + mediaID);
      
      //send comment
      if (text.indexOf('@millertestbot') > -1) { //if bot is summoned...
        console.log('valid text');
        request.post({
          url: 'https://www.instagram.com/web/comments/' + mediaID + '/add/',
          headers: headers,
          data: {comment_text: 'This work, taken as a whole, lacks serious literary, artistic, political, or scientific value.'},
          jar: j,
        }, function(error, response, body) {
          console.log(error);
        });
//        request.post('https://www.instagram.com/web/comments/' + mediaID + '/add/').form({comment_text:'This work, taken as a whole, lacks serious literary, artistic, political, or scientific value.'})
      }
    }
  }
  lastTime = currentTime; //move up lastTime
        
  setTimeout(function() {
    getNotif();
  }, 5000);
}

getNotif();