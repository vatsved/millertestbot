var request = require('request');
var config = require('./config.json');

var notif;
var lastTime = Date.now()/1000;
var currentTime;
var jar = request.jar();
request = request.defaults({jar:jar});
jar.setCookie(request.cookie('ds_user_id=' + config.ds_user_id), 'https://www.instagram.com/');
jar.setCookie(request.cookie('sessionid=' + config.sessionid), 'https://www.instagram.com/');
jar.setCookie(request.cookie('csrftoken=' + config.csrftoken), 'https://www.instagram.com/');
var postQueue = [];
var posting = false;

function getNotif() {
  request.get({
    url: 'https://www.instagram.com/accounts/activity/?__a=1',
  }, function(error, response, body) {
    notif = JSON.parse(body).activityFeed.stories;
    currentTime = Date.now()/1000;
    console.log('\nretrieved json: ' + notif.length);
    console.log('current time: ' + currentTime);
    loop();
  });
}

function loop() {
  for (i = 0; i < notif.length; i++) {

    if (notif[i].timestamp < lastTime) {break;} //if notification is too old, break

    console.log('notification: ' + i);
    var text = '';
    var mediaID = '';
    var mediaCode = '';
    var username = '';

    //grab data
    try {
      text = notif[i].text;
      mediaID = notif[i].media.id;
      mediaCode = notif[i].media.code; //needed for headers
      username = notif[i].user.username;
    } catch (err) {
      console.log('error grabbing attributes: ' + err); //most likely trying to grab text from a follow notification
      continue;
    }

    //trims mediaID; posting an answer requires the part up to an underscore
    for (j = 0; j < mediaID.length; j++) { 
      if (mediaID.charAt(j) == '_') {
        mediaID = mediaID.slice(0, j);
      }
    }

    console.log('\ntext: ' + text);
    console.log('mediaID: '+ mediaID);
    console.log('mediaCode: ' + mediaCode);
    console.log('username: ' + username);
    console.log('csfrtoken: ' + config.csrftoken);

    //send comment
    if (text.indexOf('@millertestbot') > -1) { //if bot is summoned...
      console.log('\nsending comment...');
      postQueue.push({mediaID: mediaID, mediaCode: mediaCode, username: username});
    }

  }
  if (!posting && postQueue.length > 0) {
    posting = true;
    postComments();
  }
  lastTime = currentTime;
  setTimeout(function() {
    getNotif();
  }, 10000); //checks every 10 seconds, reducing traffic on server
}

function postComments() {
  var data = postQueue.pop();
  var mediaID = data.mediaID;
  var mediaCode = data.mediaCode;
  var username = data.username;
  
  request.post({
    url: 'https://www.instagram.com/web/comments/' + mediaID + '/add/',
    headers: {referer: 'https://www.instagram.com/p/' + mediaCode, 'x-csrftoken': config.csrftoken},
    formData: {comment_text: '@' + username + ': This work, taken as a whole, lacks serious literary, artistic, political, or scientific value.'}, //adding the username of the requester increases question variability which helps hide from the spam filter
  }, function(error, response, body) {
    console.log(body); //an HTML response is an error (redirects to error page), JSON is success!
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