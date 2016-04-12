#millertestbot

##what is this?

It's an Instagram bot that detects when people mention it and comments the third prong of the Miller Test.

Obviously, *if the account is private or the bot is blocked it cannot comment*.

##installation

Use `npm install` to install dependencies. Then, create a file called `config.json` and put this in:

    {
      "ds_user_id": "YOUR_COOKIE_HERE",
      "sessionid":	"YOUR_COOKIE_HERE",
      "csrftoken": "YOUR_COOKIE_HERE"
    }

These cookie values can be found after logging into Instagram on a web browser