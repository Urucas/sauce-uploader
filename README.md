# sauce-uploader [![Build Status](https://travis-ci.org/Urucas/sauce-uploader.svg)](https://travis-ci.org/Urucas/sauce-updaloder)

Are you planning to run some Appium tests on Sauce Labs ?
Make sure you upload your app first. Use **sauce-uploader**, let him handle it for you.

#Install
```bash
npm install --save sauce-uploader
```

#Usage
**API**
```javascript
import uploader from 'sauce-uploader'
let settings = {user: keys["user"], access_key: keys["accessKey"], app_path: "full_path_to_app"}
uploader.upload(settings, (err, response) {
   /* handle callback response
    * { username: 'vrunoa',
    *   size: 1423095,
    *   md5: '68e280e4de9116e2d095e13cca25cd68',
    *  filename: 'app-debug.apk' }
    */
   // set the capabilities for your appium tests
   let app = ["sauce-storage", response["filename"]].join(":")
   let capabilities = {
     "deviceName":"Android",
     "host":"ondemand.saucelabs.com",
     "port":80,
     "app" : app,
     "username" : keys["user"],
     "accessKey": keys["accessKey"],
     "app-package":"com.urucas.kriket",
     "appWaitActivity": "com.urucas.kriket.activities.LoginActivity",
     "browserName" : "",
     "platformName":"Android",
     "deviceName": "Android Emulator",
     "platformVersion": "5.0", 
     "appium-version" : "1.4.7"
   }
   // set the wd capabilities and run your tests
   // ...
});

// sync
let [err, response] = uploader.uploadSync(settings);
```

Now run your appium test on Sauce Labs cloud!

**CLI**
```bash
npm install -g sauce-uploader
sauce-uploader <user> <access_key> <full_path_to_app> [--verbose]
```

#Example
Before running the examples inside **[example/mocha](https://github.com/Urucas/sauce-uploader/tree/master/example/mocha)** folder, make sure you addd your current Sauce Labs [keys](https://docs.saucelabs.com/reference/rest-api/).

* Node
```bash
cd example/mocha
npm install
npm test
```

* Python
```bash
cd example/python
python login_test.py
```

Go to Sauce Labs [dashboard](https://saucelabs.com/beta/dashboard/tests) and watch it running!

<img src="https://raw.githubusercontent.com/Urucas/sauce-uploader/master/screen.png" />
