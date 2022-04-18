# GoogleMeetBot

Bot for scheduling and entering google meet sessions automatically.
### New Features
- Sends a message to discord via webhook whenever a join / leave request was sent.
- Logs into oauth2 playground then redirects to google meet instead of directly logging into google meet to avoid detections.

### Requirements

- [Node.js](https://nodejs.org/en/download/) should be installed
- [Google Chrome](https://www.google.com/intl/en_in/chrome/) with version 70+
-  Works only on windows (adding support for procursus macs)

### If you want to see the whole process

On line ‘16’ of ‘server.js’ file you can see a variable name head=false;

If you want to see bot automatically opening the page and filling login values and joining meet link then you can set the headless as flase.

But while for deployment we need headless as true.

### Deployment

If you want to deploy your instance of app you need it to set it up properly.
The main problem on deployment is that after deployment it will be hosted on different IP and when bot tries to sign in Google will ask to login again with `one time password`.

### How it works

Project is made using [Puppeteer](https://developers.google.com/web/tools/puppeteer) which is a Node library which provides a high-level API to control headless Chrome or Chromium. We open a chromium app on server where we can add create open tabs see browser versions and everything.

So here we are using `puppeteer-extra` and `puppeteer-extra-plugin-stealth` which helps in creating an instance of chrome where google won't be able to detect that it is created by puppeteer. So using this plugin we can login into google without filling capcha.

---
