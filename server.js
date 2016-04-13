var request = require('request');
var cheerio = require('cheerio');

var config = require('./config.json');

var headers = {};
var notif;
var notifCount;
var oldNotifCount = -1;
var currentTime;
var jar = request.jar();
request = request.defaults({jar:jar});
jar.setCookie(request.cookie('ds_user_id=' + config.ds_user_id), 'https://www.instagram.com/');
jar.setCookie(request.cookie('sessionid=' + config.sessionid), 'https://www.instagram.com/');
jar.setCookie(request.cookie('csrftoken=' + config.csrftoken), 'https://www.instagram.com/');
var postQueue = [];

function getNotif() {
  request.get({
    url: 'https://www.instagram.com/accounts/activity/?__a=1',
  }, function(error, response, body) {
    notif = JSON.parse(body).activityFeed.stories;
    notifCount = notif.length;
    if (oldNotifCount == -1) {
      oldNotifCount = notifCount;
    }
    console.log('retrieved json: ' + notifCount);
    loop();
  });
  
}

function loop() {
  if (notifCount > oldNotifCount) {
    console.log('new notifications: ' + (notifCount - oldNotifCount));
    for (i = 0; i < (notifCount-oldNotifCount); i++) {
      
      console.log('notification ' + i);
      var text = '';
      var mediaID = '';
      var mediaCode = '';

      //grab data
      try {
        text = notif[i].text;
        mediaID = notif[i].media.id;
        mediaCode = notif[i].media.code; //needed for headers
      } catch (err) {
        console.log('error grabbing attributes: '); //most likely trying to grab text from a follow notification
      }
      
      for (j = 0; j < mediaID.length; j++) {
        if (mediaID.charAt(j) == '_') {
          mediaID = mediaID.slice(0, j);
        }
      }

      console.log('text: ' + text);
      console.log('mediaID: '+ mediaID);
      console.log('mediaCode: ' + mediaCode);
      console.log('csfrtoken: ' + config.csrftoken);

      
      
        
      //send comment
      if (text.indexOf('@millertestbot') > -1) { //if bot is summoned...
        console.log('valid text');
        postQueue.push({mediaID: mediaID, mediaCode: mediaCode});
      }

    }
    if (!posting && postQueue.length > 0) {
      posting = true;
      postComments();
    }
//  }
  oldNotifCount = notifCount; //move up  
  
  setTimeout(function() {
    getNotif();
  }, 10000);
}

function postComments() {
  var data = postQueue.pop();
  console.log('data:');
  console.log(data);
  var mediaID = data.mediaID;
  var mediaCode = data.mediaCode;
  
  console.log('url: ' + 'https://www.instagram.com/web/comments/' + mediaID + '/add/');
  console.log('headers: ' + 'https://www.instagram.com/p/' + mediaCode);
  
  request.post({
    url: 'https://www.instagram.com/web/comments/' + mediaID + '/add/',
    headers: {referer: 'https://www.instagram.com/p/' + mediaCode, 'x-csrftoken': config.csrftoken},
    formData: {comment_text: 'This work, taken as a whole, lacks serious literary, artistic, political, or scientific value.'},
  }, function(error, response, body) {
    console.log(body);
    
    console.log(postQueue.length);
    if (postQueue.length == 0) {
      posting = false;
      return;
    } else {
      setTimeout(function() {
        postComments();  
      }, 5000);
      
    }
  });
}

getNotif();