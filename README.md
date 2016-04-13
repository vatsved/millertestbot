#millertestbot

##what is this?

It's an Instagram bot that detects when people mention it and comments the third prong of the Miller Test.

Obviously, *if the account is private or the bot is blocked it cannot comment*.

##usage

Simply comment @millerbot on any public Instagram post!

##installation

Use `npm install` to install dependencies. Then, take a look into `config.json` and put in the corresponding cookies:

    {
      "ds_user_id": "YOUR_COOKIE_HERE",
      "sessionid":	"YOUR_COOKIE_HERE",
      "csrftoken": "YOUR_COOKIE_HERE"
    }

These cookie values can be found after logging into Instagram on a web browser. In Chrome, visit `settings://cookies` and grab the Instagram cookies there.