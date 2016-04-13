#millertestbot

##what is this?

It's an Instagram bot that detects when people mention it and comments the third prong of the Miller Test.

Obviously, *if the account is private or the bot is blocked it cannot comment*.

##usage

Simply comment "@millerbot" on any public Instagram post!

##installation

Use `npm install` to install dependencies. Then, create a new file `cookies.json` and put in the corresponding cookies:

    {
      "ds_user_id": "YOUR_COOKIE_HERE",
      "sessionid":	"YOUR_COOKIE_HERE",
      "csrftoken": "YOUR_COOKIE_HERE"
    }

These cookie values can be found after logging into Instagram on a web browser. In Chrome, visit `settings://cookies` and grab the Instagram cookies there.

Next, go into keywords.json and change the appropriate values, which will be explained shortly.

##keywords

You can change what is used to summon the bot and what the bot replies by editing "keywords.json":

    {
      "keyword": "ayy lmao",
      "response": "dank meme tbh fam"
    }
    
Note that the bot will only take and send back the first query/response if a user's comment includes multiple keywords. For example, if a user comments "@millertestbot keyword1 keyword2" and "keywords.json" looks like this:

    {
      "keyword": "keyword1",
      "response": "lmao xd"
    },
    {
      "keyword": "keyword2",
      "response": "wow RAUNCHY"
    }
    
The bot will only comment "lmao xd". You can actually remove this and get the bot to send a multiple comments from a single tag by removing a certain `break` somewhere.

If you want the bot to automatically respond to a tag simply make `keyword` empty: 

    {
      "keyword": "",
      "response": "This work, taken as a whole, lacks serious literary, artistic, political, or scientific value."
    }